export const searchCity = async (CityName: string) => {
  const cities = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    body: JSON.stringify({
      modelName: 'Address',
      calledMethod: 'searchSettlements',
      methodProperties: { CityName, Limit: 50, Page: 1 },
    }),
    method: 'POST',
  }).then((res) => res.json());
  if (!cities.data.length) return [];
  return cities.data[0].Addresses;
};

export interface DepartmentNP {
  Description: string;
  Ref: string;
  TypeOfWarehouse: string;
}

interface SearchDepartmentsResponse {
  data: DepartmentNP[];
}

export const searchDepartments = async (CityRef: string) => {
  const departments: SearchDepartmentsResponse = await fetch(
    'https://api.novaposhta.ua/v2.0/json/',
    {
      body: JSON.stringify({
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: { CityRef },
      }),
      method: 'POST',
    }
  ).then((res) => res.json()); // CityRecipient (cityRef), RecipientAddress (ref)

  if (!departments.data.length) return [];
  const filteredDepartments = departments.data.filter(
    (d) => d.TypeOfWarehouse !== 'f9316480-5f2d-425d-bc2c-ac7cd29decf0'
  );
  return filteredDepartments;
};
