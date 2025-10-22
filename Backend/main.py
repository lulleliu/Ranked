from fastapi import FastAPI
from pydantic import BaseModel
import pprint

from courses_data import mock_data

app = FastAPI()

class LoginData(BaseModel):
    username: str
    password: str


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/api/get_courses")
async def get_courses(data: LoginData):
    """
    from course_gatherer import LadokSession

    ls = LadokSession(username=data.username, password=data.password)
    print("hello")

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

    pprint.pprint(courses_sorted)
    return courses_sorted
    """
    
    return mock_data