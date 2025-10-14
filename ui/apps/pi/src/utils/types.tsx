export enum AllegatoUploadStatuses {
    QUEUED, // in coda
    UPLOADING, // scelti per il caricamento (il sistema deve far partire la richiesta al server)
    IN_PROGRESS, // in fase di caricamento effettivo (è stata fatta la richiesta al server)
    UPLOADED, // caricati
    ERROR // errore nel caricamento
};

export enum AllegatoDownloadStatuses {
    READY,
    DOWNLOADING,
    DOWNLOADING_ORIGINAL,
    ERROR
};

export enum AllegatoTimbroPosizione {
    TOP = 'top',
    BOTTOM = 'down',
    LEFT = 'left',
    RIGHT = 'right'
};

export enum StatoProtocollazione {
    PROTOCOLLATO = 'PROTOCOLLATO',
    NON_PROTOCOLLATO = 'NON_PROTOCOLLATO'
}
export enum StatoClassificazione {
    CLASSIFICATO = 'CLASSIFICATO',
    NON_CLASSIFICATO = 'NON_CLASSIFICATO'
}

export enum StatoAssegnazione {
    ASSEGNATO = 'ASSEGNATO',
    NON_ASSEGNATO = 'NON_ASSEGNATO'
}

export enum StatoLavorazionePec {
    LAVORATE = 'LAVORATE',
    NON_LAVORATE = 'NON_LAVORATE'
}