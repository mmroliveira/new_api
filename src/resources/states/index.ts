interface IStates {
  name: string;
  abbreviation: string;
  state_id: number;
  country: number;
}

interface StatesArray extends Array<IStates> {}

const states: StatesArray = [
  { state_id: 11, abbreviation: "RO", name: "Rondônia", country: 1 },
  { state_id: 12, abbreviation: "AC", name: "Acre", country: 1 },
  { state_id: 13, abbreviation: "AM", name: "Amazonas", country: 1 },
  { state_id: 14, abbreviation: "RR", name: "Roraima", country: 1 },
  { state_id: 15, abbreviation: "PA", name: "Pará", country: 1 },
  { state_id: 16, abbreviation: "AP", name: "Amapá", country: 1 },
  { state_id: 17, abbreviation: "TO", name: "Tocantins", country: 1 },
  { state_id: 21, abbreviation: "MA", name: "Maranhão", country: 1 },
  { state_id: 22, abbreviation: "PI", name: "Piauí", country: 1 },
  { state_id: 23, abbreviation: "CE", name: "Ceará", country: 1 },
  { state_id: 24, abbreviation: "RN", name: "Rio Grande do Norte", country: 1 },
  { state_id: 25, abbreviation: "PB", name: "Paraíba", country: 1 },
  { state_id: 26, abbreviation: "PE", name: "Pernambuco", country: 1 },
  { state_id: 27, abbreviation: "AL", name: "Alagoas", country: 1 },
  { state_id: 28, abbreviation: "SE", name: "Sergipe", country: 1 },
  { state_id: 29, abbreviation: "BA", name: "Bahia", country: 1 },
  { state_id: 31, abbreviation: "MG", name: "Minas Gerais", country: 1 },
  { state_id: 32, abbreviation: "ES", name: "Espírito Santo", country: 1 },
  { state_id: 33, abbreviation: "RJ", name: "Rio de Janeiro", country: 1 },
  { state_id: 35, abbreviation: "SP", name: "São Paulo", country: 1 },
  { state_id: 41, abbreviation: "PR", name: "Paraná", country: 1 },
  { state_id: 42, abbreviation: "SC", name: "Santa Catarina", country: 1 },
  { state_id: 43, abbreviation: "RS", name: "Rio Grande do Sul", country: 1 },
  { state_id: 50, abbreviation: "MS", name: "Mato Grosso do Sul", country: 1 },
  { state_id: 51, abbreviation: "MT", name: "Mato Grosso", country: 1 },
  { state_id: 52, abbreviation: "GO", name: "Goiás", country: 1 },
  { state_id: 53, abbreviation: "DF", name: "Distrito Federal", country: 1 },
];

export { states };
