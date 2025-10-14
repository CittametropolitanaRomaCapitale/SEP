import * as generated from './generated';

const api = generated.api.enhanceEndpoints({
  addTagTypes: [
    'Determine',
    'Attivita',
    'AttivitaPendenti',
    'DettaglioAttivita',
    'DettaglioDetermina',
    'SoggettiDetermina',
    'DettaglioFormAnac',
    'DettaglioFormGpp',
    'FasciaControllo',
    'DefaultDetermine',
    'DefaultListe',
    'ValidazioneTab'
  ],
  endpoints: {
    saveDetermina: {
      invalidatesTags: ['Determine', 'Attivita', 'AttivitaPendenti']
    },
    updateDetermina: {
      invalidatesTags: [
        'DettaglioAttivita',
        'DettaglioDetermina',
        'ValidazioneTab'
      ]
    },
    duplicaDetermina: {
      invalidatesTags: ['Determine', 'Attivita', 'AttivitaPendenti']
    },
    getDetermine: {
      providesTags: ['Determine']
    },
    getAttivitaPendenti: {
      providesTags: ['AttivitaPendenti']
    },
    getAttivita: {
      providesTags: ['Attivita']
    },
    rivenditaAttivita: {
      invalidatesTags: ['DettaglioAttivita']
    },
    rilasciaAttivita: {
      invalidatesTags: ['DettaglioAttivita']
    },
    getAttivitaDetails: {
      providesTags: ['DettaglioAttivita'],
      transformResponse: (
        response: generated.GetAttivitaDetailsQuery,
        meta,
        arg
      ) => {
        return {
          ...response,
          singola_attivita_uuid: {
            ...response?.singola_attivita_uuid,
            determina: {
              ...response?.singola_attivita_uuid?.determina,
              skipResponsabileProcedimento:
                response?.singola_attivita_uuid?.determina
                  ?.skipResponsabileProcedimento ?? false,
              vistoDipartimentale:
                response?.singola_attivita_uuid?.determina
                  ?.vistoDipartimentale ?? true,
              anac: response?.singola_attivita_uuid?.determina?.anac ?? false,
              gpp: response?.singola_attivita_uuid?.determina?.gpp ?? false,
              template_type: response?.singola_attivita_uuid?.determina?.ato2
                ? response?.singola_attivita_uuid?.determina?.tipoDetermina ===
                  'contabileSenzaSpesaAto2'
                  ? response?.singola_attivita_uuid?.determina?.template_type
                  : generated.TemplateDeterminaType?.Ato2
                : response?.singola_attivita_uuid?.determina?.template_type
            }
          }
        };
      }
    },
    updateRiferimentiContabili: {
      invalidatesTags: ['DettaglioAttivita', 'ValidazioneTab']
    },
    completaAttivita: {
      invalidatesTags: ['DettaglioAttivita']
    },
    updateValidaCapitolo: {
      invalidatesTags: ['DettaglioAttivita']
    },
    updateValidaPrenotazione: {
      invalidatesTags: ['DettaglioAttivita']
    },
    updateValidaImpegnoAccertamento: {
      invalidatesTags: ['DettaglioAttivita']
    },
    getDeterminaDetails: {
      providesTags: ['DettaglioDetermina']
    },
    deleteDetermina: {
      invalidatesTags: ['DettaglioDetermina']
    },
    getSoggettiDetermina: {
      providesTags: ['SoggettiDetermina']
    },
    saveProprietaOffuscate: {
      invalidatesTags: ['DettaglioAttivita']
    },
    saveProprietaOffuscateSoggetto: {
      invalidatesTags: ['DettaglioAttivita', 'SoggettiDetermina']
    },
    saveNota: {
      invalidatesTags: ['DettaglioAttivita', 'DettaglioDetermina']
    },
    getAnacDetails: {
      providesTags: ['DettaglioFormAnac']
    },
    saveAnacForm: {
      invalidatesTags: ['DettaglioFormAnac']
    },
    updateAnacForm: {
      invalidatesTags: ['DettaglioFormAnac']
    },
    saveAnacInvitato: {
      invalidatesTags: ['DettaglioFormAnac']
    },
    updateAnacInvitato: {
      invalidatesTags: ['DettaglioFormAnac']
    },
    deleteAnacInvitato: {
      invalidatesTags: ['DettaglioFormAnac']
    },
    saveAnacGruppoInvitato: {
      invalidatesTags: ['DettaglioFormAnac']
    },
    updateAnacGruppoInvitato: {
      invalidatesTags: ['DettaglioFormAnac']
    },
    deleteAnacGruppoInvitato: {
      invalidatesTags: ['DettaglioFormAnac']
    },
    getDeterminaGpp: {
      providesTags: ['DettaglioFormGpp']
    },
    saveGppCategoria: {
      invalidatesTags: ['DettaglioFormGpp']
    },
    updateGppCategoria: {
      invalidatesTags: ['DettaglioFormGpp']
    },
    deleteGppCategoria: {
      invalidatesTags: ['DettaglioFormGpp']
    },
    getFasciaControllo: {
      providesTags: ['FasciaControllo']
    },
    saveFasciaControllo: {
      invalidatesTags: ['FasciaControllo']
    },
    updateFasciaControllo: {
      invalidatesTags: ['FasciaControllo']
    },
    deleteFasciaControllo: {
      invalidatesTags: ['FasciaControllo']
    },
    deleteFasciaControlloDefinito: {
      invalidatesTags: ['FasciaControllo']
    },
    deleteFasceControllo: {
      invalidatesTags: ['FasciaControllo']
    },
    getDefaultDetermine: {
      providesTags: ['DefaultDetermine']
    },
    saveCampoDefaultDetermina: {
      invalidatesTags: ['DefaultDetermine']
    },
    saveCampiDefaultDetermina: {
      invalidatesTags: ['DefaultDetermine']
    },
    getDefaultListe: {
      providesTags: ['DefaultListe']
    },
    saveDefaultLista: {
      invalidatesTags: ['DefaultListe']
    },
    updateDefaultLista: {
      invalidatesTags: ['DefaultListe']
    },
    deleteDefaultLista: {
      invalidatesTags: ['DefaultListe']
    },
    updateDeterminaPreferita: {
      invalidatesTags: ['DettaglioDetermina', 'Determine']
    },
    deleteDocumento: {
      invalidatesTags: ['DettaglioAttivita']
    },
    getValidazioneTab: {
      providesTags: ['ValidazioneTab']
    },
    updateValidaMovimenti: {
      invalidatesTags: ['ValidazioneTab']
    }
  }
});

export default api;
