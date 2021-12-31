/*
        {
            "value": 3360946,
            "state": "Normal",
            "deleted": false,
            "_id": "61af505e3b264935b484955f",
            "point": 7,
            "time_stamp": "2021-12-06T05:00:00.000Z",
            "user": 2,
            "created_at": "2021-12-07T12:15:26.605Z",
            "updatedAt": "2021-12-07T12:15:26.605Z",
            "__v": 0
        }

                {
    "skip": 0,
    "limit": "100",
    "total": 2549,
    "data": [
*/

export interface ValuesResponse {
    skip: number;
    limit: number;
    total: number;
    data: PointValue[];
}

export interface PointValue {
    _id:string;
    value: number;
    state: string;
    deleted: string;
    time_stamp: Date;
    user: number;
    created_at: Date;
    point: number;
}