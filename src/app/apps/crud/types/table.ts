type ColumnType =
    | 'date'
    | 'time'
    | 'image'
    | 'price'
    | 'switcher'
    | 'translate'
    | 'yesNo';

export interface TableColumn {
    field: string;
    header?: string;
    width?: string;
    type?: ColumnType;
    sortable?: boolean;
    primary?: boolean;
}
