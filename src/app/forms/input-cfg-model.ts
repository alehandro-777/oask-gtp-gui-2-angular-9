/*
            "id": "102",
            "name": "102",
            "label": "КС-Бобровницька-05.N ГПА",
            "value": "2",
            "type": "number",
            "min": "0",
            "max": "3",
            "step": "0.1",
            "options": []

The following input types can be used with matInput:

color
date
datetime-local
email
month
number
password
search
tel
text
time
url
week


*/

export class InputCfg {
    id: string;
    value: string;
    name: string;
    label: string;    
    type: string;
    min?: string;
    max?: string;
    step?: string;
    options?:{ key: string, value: string }[] 
}