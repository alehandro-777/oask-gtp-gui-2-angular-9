/*
            "id": "102",
            "name": "102",
            "label": "КС-Бобровницька-05.N ГПА",
            "value": "2",
            "type": "number",
            "min": "0",
            "max": "3",
            "regex": "regex_for_validation",
            "_id": 7,
            "options": [],
*/

export class InputCfg {
    id: string;
    value: string;
    name: string;
    label: string;    
    type: string;
    min: string;
    max: string;
    options:{ key: string, value: string }[] 
}