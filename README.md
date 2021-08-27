# Analysis of Census 2020 data for Kentucky
### Kentucky grew more diverse in the past decade
### Main Tools used: Mapbox Studio, Mapbox GL JS, d3.js, Geocoder, HTML, CSS, ai2html, python
### other tools used: Google Sheets, SQLite, matplotlib, QGIS, mapshaper, Adobe Illustrator, JS, jQuery, TablePlus
### Data Source: Census 2020 for Kentucky

# Map steps:
1. Download Census Microsoft Shell and .pl files for Kentucky
2. Convert Shell to SQLite database online
3. Use TablePlus to create SQLite connection
4. Add .txt extenstion to .pl files
5. Load shell in SQLite and then import .txt files in each four tables
6. Run queries and then export datasets
7. Load csv files in pandas and clean it up 
8. Export trimmed files
9. Download shapefiles and clean it in Mapshaper
10. Do cleaning in QGIS and export it as geojson 
11. Upload geojson to Mapbox Studio
12. Style layers in Studio
13. Use handlebars tempating framework that uses npm to load the map
14. Add data at runtime
15. add interactivity
16. create six buttons and make each layer to load on click
17. use d3.js to create a bar chart that appears on click 
18. Do other stuff such as draw boundaries on click, flyto and zoom on click
19. Make legend in adobe illusrator and export it as an svg
20. do some finetunning

#### Two charts in the project were made using matplotlib and cleaned in adobe illustrator. ai2html script were used to create the output