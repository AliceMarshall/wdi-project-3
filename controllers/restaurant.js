const rp = require('request-promise');
const Promise = require('bluebird');

function restaurantsIntersect(req, res, next) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  const params = {
    method: 'GET',
    url: baseUrl,
    json: true,
    qs: {
      radius: 5000,
      types: 'restaurant',
      key: 'AIzaSyCIloO-4lo_gugWpXq3wLuCdB9gResKvN0'
    }
  };

  function getAllResults(lat, lng) {
    params.qs.location = `${lat},${lng}`;
    let allResults = [];
    return new Promise((resolve, reject) => {

      function makeRequest() {
        rp(params)
          .then((response) => {
            console.log(response);
            if(response.status === 'INVALID_REQUEST') return makeRequest();
            if(response.status !== 'OK') reject(new Error(response.status));

            allResults = allResults.concat(response.results);

            if(response.next_page_token) {
              params.qs.pagetoken = response.next_page_token;
              return makeRequest();
            }

            return resolve(allResults);
          });
      }

      makeRequest();
    });
  }

  Promise.props({
    locationA: getAllResults(51.544237, -0.051679),
    locationB: getAllResults(req.query.userLat, req.query.userLng)
  })
  .then((response) => {
    console.log(response);
    const resultSet = response.locationA.concat(response.locationB);
    const ids = [];
    const filteredResults = resultSet.filter((obj) => {
      if(ids.includes(obj.place_id)) {
        return true;
      } else {
        ids.push(obj.place_id);
        return false;
      }

    });
    res.json(filteredResults);
  })
  .catch(next);
}

module.exports = {
  restaurantsIntersect
};