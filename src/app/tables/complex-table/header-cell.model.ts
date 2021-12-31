export interface HeaderCellModel {
    key: string;    //unique header-cell key
    text: string;   //text of last row should be == row object key {".t.e.x.t.":"12.34", ...} 
    rowspan: string;    //default =1
    colspan: string;    //default =1
    fixed?: string;  //decimal places
    select?: string;  //decimal places 
}