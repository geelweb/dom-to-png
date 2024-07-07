# dom-to-png

Simple app to take a screenshot of a dom element using [Puppeter](https://pptr.dev).

Initialy created to save png images of [leafletjs map](https://leafletjs.com/) and [Chart.js graphs](https://www.chartjs.org/) to be inserted in pdf created using [weasyprint](https://weasyprint.org/).

Example usage:

```
npm start
curl -XGET -G "http://localhost:3600" --data-urlencode "url=https://leafletjs.com/" --data-urlencode "id=map" --output "map.png"
```
