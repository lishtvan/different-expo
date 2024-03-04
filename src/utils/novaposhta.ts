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
