/*
        {
            "name": "Tмитт",
            "short_name": "T",
            "full_name": "Мринське ВУПЗГ.ВОГ ПСГ Мрин.",
            "type": "number",
            "eu": "гр.С",
            "min": "0",
            "max": "100",
            "step": "0.1",
            "deadband": 0,
            "min_rate": 0,
            "readonly": false,
            "params": [],
            "deleted": false,
            "_id": 3,
            "__v": 0,
            "created_at": "2021-12-07T12:13:17.022Z",
            "updated_at": "2021-12-07T12:13:17.022Z"
        }

        "options": {
            "_id": 1,
            "set_name": "Стан ПСГ",
            "kvp": [
                {
                    "key": "0",
                    "value": "Нейтр"
                },
                {
                    "key": "1",
                    "value": "Закачка"
                },
                {
                    "key": "2",
                    "value": "Відбор"
                }
            ],
            "__v": 0
        }
*/

export interface Options {
    set_name : string;
    kvp: { key: string, value: string }[];
}

export interface DbPointCfg {
    _id: number;
    name: string;
    short_name: string;
    full_name: string;
    type: string;
    eu: string;
    min: string;
    max: string;
    step: string;
    deadband: number;
    min_rate: number;
    readonly: boolean;
    deleted: boolean;
    options?: Options
}