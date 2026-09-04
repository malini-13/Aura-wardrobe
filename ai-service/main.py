from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

app = FastAPI(title='Aura AI Service')

class StylingRequest(BaseModel):
    text: str

@app.get('/health')
def health(): return {'status':'ok','service':'aura-ai'}

@app.post('/parse-style-request')
def parse_style_request(request: StylingRequest):
    text = request.text.lower()
    return {'occasion': next((x for x in ['presentation','college','party','date','work'] if x in text), 'casual'), 'comfort':'high' if 'comfortable' in text else 'medium', 'rawText': request.text}

@app.post('/analyze-clothing-image')
async def analyze_clothing_image(image: UploadFile = File(...)):
    # Replace this deterministic, editable draft with a pretrained vision model.
    return {'fileName':image.filename,'category':'top','colors':['unknown'],'pattern':'unknown','fit':'unknown','confidence':0.0,'note':'Starter service: connect CLIP or a vision API here.'}
