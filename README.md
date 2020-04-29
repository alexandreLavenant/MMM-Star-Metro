# MMM-Star-Metro

This a module for <strong>MagicMirror</strong><br>
https://magicmirror.builders/<br>
https://github.com/MichMich/MagicMirror

![Screenshot](./screenshots/MMM-Star-Metro.png?raw=true "Screenshot")

A module that displays the next records from the Rennes Star metro.


## Installation

1. Navigate into your MagicMirror `modules` folder and execute<br>
`git clone https://github.com/alexandreLavenant/MMM-Star-Metro.git`.
2. Add the module inside `config.js`.


## Configuration

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>updateInterval</code></td>
      <td>How frequently, in seconds, to update the display.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>60</code></td>
    </tr>
    <tr>
      <td><code>stationName</code></td>
      <td>Name of the metro station in the city of Rennes. See https://data.explore.star.fr/explore/dataset/tco-metro-circulation-passages-tr/api/ for the list<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>République</code></td>
    </tr>
    <tr>
      <td><code>direction</code></td>
      <td>Wich way the metro is going.<br><code>0</code> from North to South.
      <br><code>1</code> from South to North.
      <br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>1</code></td>
    </tr>
    <tr>
      <td><code>displayedRecords</code></td>
      <td>Number of metro records to display.<br><br><strong>Type</strong> <code>String</code><br>Defaults to 2</td>
    </tr>
  </tbody>
</table>

## Sample Configuration

```
{
  module: "MMM-Star-Metro",
  header: "Metro",
  position: "top_right",
  config: {
    updateInterval: 30 // 30 seconds
    stationName: "Saint-Anne",
    direction: 1,
    displayedRecords: 3
  }
},
```

## Attributions

**Metro data provided by the city of Rennes**<br />
https://data.explore.star.fr/explore/dataset/tco-metro-circulation-passages-tr/information/