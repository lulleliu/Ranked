# -*- coding: utf-8 -*-
import datetime
import html
import re
import requests
import urllib.parse
import json
import sys
    
from pprint import pprint
    
base_url = 'https://www.student.ladok.se/student/proxy'
    
    
class LadokSession():
    def __init__(self, username, password):
        self.signed_in = False
        self.__session = None
        self.__headers = { 'Accept': 'application/vnd.ladok-resultat+json, application/vnd.ladok-kataloginformation+json, application/vnd.ladok-studentinformation+json, application/vnd.ladok-studiedeltagande+json, application/vnd.ladok-utbildningsinformation+json, application/vnd.ladok-examen+json, application/vnd.ladok-extintegration+json, application/vnd.ladok-uppfoljning+json, application/vnd.ladok-extra+json, application/json, text/plain' }
        self.__grade_scales = []
        self.__grade_by_id = {}
    
        if username.endswith('@kth.se'):
            username = username[0:-7] + '@ug.kth.se'
    
        if '@' not in username:
            username += '@ug.kth.se'
    
        s = requests.session()
    
        s.headers.update({
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
        })
    
        r = s.get(url='https://www.student.ladok.se/student/ladok/L3')
        r = s.get(url='https://www.student.ladok.se/student/login?ret=/app/studentwebb')
    
        shibstate = re.search('return=(.*?)(&|$)', r.url).group(1)
        url = urllib.parse.unquote(shibstate)
    
        r = s.get(url=url + '&entityID=https://saml.sys.kth.se/idp/shibboleth')
    
        csrf_token = re.search('<input type="hidden" name="csrf_token" value="(.*?)" />', r.text).group(1)
    
        post_data = {
            'csrf_token': csrf_token,
            'shib_idp_ls_exception.shib_idp_session_ss': '',
            'shib_idp_ls_success.shib_idp_session_ss': 'true',
            'shib_idp_ls_value.shib_idp_session_ss': '',
            'shib_idp_ls_exception.shib_idp_persistent_ss': '',
            'shib_idp_ls_success.shib_idp_persistent_ss': 'true',
            'shib_idp_ls_value.shib_idp_persistent_ss': '',
            'shib_idp_ls_supported': 'true',
            '_eventId_proceed': '',
        }
    
        r = s.post(url='https://saml-5.sys.kth.se/idp/profile/SAML2/Redirect/SSO?execution=e1s1', data=post_data)
    
        action = re.search('<form method="post" id="loginForm" .*? action="(.*?)" >', r.text).group(1)
    
        post_data = {
            'UserName': username,
            'Password': password,
            'AuthMethod': 'FormsAuthentication',
        }
    
        r = s.post(url='https://login.ug.kth.se' + action, data=post_data)
    
        if 'Ogiltigt anv&#228;ndar-ID eller l&#246;senord.' in r.text:
            raise Exception('Incorrect username or password.')
    
        # First automatic post
        action = re.search('<form method="POST" name="hiddenform" action="(.*?)">', r.text).group(1)
        relay_state = re.search('<input type="hidden" name="RelayState" value="([^"]+)" \\/>', r.text).group(1)
        saml_response = re.search('<input type="hidden" name="SAMLResponse" value="(.*?)" />', r.text).group(1)
    
        post_data = {
            'RelayState': relay_state,
            'SAMLResponse': saml_response,
        }
    
        r = s.post(url=action, data=post_data)
    
        if 'Show this again if information to be provided to this service changes' in r.text:
            csrf_token = re.search('<input type="hidden" name="csrf_token" value="([^"]+)" />', r.text).group(1)
    
            r = s.post(
                url='https://saml-5.sys.kth.se/idp/profile/SAML2/Redirect/SSO?execution=e1s3',
                data={
                    'csrf_token': csrf_token,
#					'_shib_idp_consentIds': ['eduPersonAssurance', 'eduPersonPrincipalName', 'eduPersonScopedAffiliation', 'norEduPersonNIN'],
                    '_shib_idp_consentIds': ['EuropeanStudentIdentifier', 'displayName', 'eduPersonAssurance', 'eduPersonPrincipalName', 'eduPersonScopedAffiliation', 'givenName', 'mail', 'norEduPersonNIN', 'personalIdentityNumber', 'samlSubjectID', 'schacDateOfBirth', 'schacHomeOrganization', 'sn'],
                    '_shib_idp_consentOptions': '_shib_idp_doNotRememberConsent',
                    '_eventId_proceed': '',
                }
            )
            
            csrf_token = html.unescape(re.search('<input type="hidden" name="csrf_token" value="(.*?)" />', r.text).group(1))
    
            r = s.post(url='https://saml-5.sys.kth.se/idp/profile/SAML2/Redirect/SSO?execution=e1s4', data={
                    'csrf_token': csrf_token,
                    'shib_idp_ls_exception.shib_idp_session_ss': '',
                    'shib_idp_ls_success.shib_idp_session_ss': 'false',
                    '_eventId_proceed': '',
                }
            )
    
        # Second automatic post
        action = html.unescape(re.search('<form action="(.*?)" method="post">', r.text).group(1))
        relay_state = html.unescape(re.search('<input type="hidden" name="RelayState" value="(.*?)"\\/>', r.text).group(1))
        saml_response = html.unescape(re.search('<input type="hidden" name="SAMLResponse" value="(.*?)"/>', r.text).group(1))
    
        post_data = {
            'RelayState': relay_state,
            'SAMLResponse': saml_response,
        }
    
        r = s.post(url=action, data=post_data)
    
        r = s.get(url='https://www.student.ladok.se/student/ladok/L3')
    
        self.signed_in = True
        self.__session = s
        self.__uid = re.search('studentUID: "([^"]+)"', r.text).group(1)
    
    def get_uid(self):
        return self.__uid
    
    def get(self, url):
        return self.__session.get(
            url=base_url + url,
            headers=self.__headers
        ).json()

if __name__ == "__main__": 
    ls = LadokSession(sys.argv[1], sys.argv[2])
        
    courses_raw = ls.get('/studiedeltagande/internal/tillfallesdeltagande/kurstillfallesdeltagande/student/' + ls.get_uid())
        
    courses = []
        
    for course in courses_raw['Tillfallesdeltaganden']:
        if 'Utbildningskod' not in course['Utbildningsinformation'] or 'UtbildningensOmfattningsvarde' not in course['Utbildningsinformation']:
            continue
        
        grade_raw = ls.get('/resultat/internal/studentenskurser/egenkursinformation/student/' + ls.get_uid() + '/kursUID/' + course['Utbildningsinformation']['UtbildningUID'])
        
        grade = None
        
        if 'Kursversioner' in grade_raw:
            for course_version in grade_raw['Kursversioner']:
                if 'ResultatPaUtbildning' not in course_version['VersionensKurs'] or 'SenastAttesteradeResultat' not in course_version['VersionensKurs']['ResultatPaUtbildning']:
                    continue
                
                if grade is not None:
                    grade = None
                    break
                
                grade = course_version['VersionensKurs']['ResultatPaUtbildning']['SenastAttesteradeResultat']['Betygsgradsobjekt']['Kod']
        
        course_exist = next((x for x in courses if x['code'] == course['Utbildningsinformation']['Utbildningskod']), None)
        
        if course_exist is not None:
            print(course_exist)
            if course_exist['grade'] is None:
                course_exist['grade'] = grade
        
        else:
            courses.append({
                'id': course['Uid'],
                'name': course['Utbildningsinformation']['Benamning']['sv'],
                'code': course['Utbildningsinformation']['Utbildningskod'],
                'points': course['Utbildningsinformation']['UtbildningensOmfattningsvarde'],
                'grade': grade,
            })
        
    courses_sorted = sorted(courses, key=lambda d: d['name'])
        
    pprint(courses_sorted)