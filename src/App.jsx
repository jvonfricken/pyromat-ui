import Card from "react-bootstrap/Card";
import ChartistGraph from "react-chartist";
import Chartist from "chartist";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import chartistPluginAxisTitle from "chartist-plugin-axistitle";
import "bootswatch/dist/flatly/bootstrap.min.css";
import "./App.css";
import { Component } from "react";

const BACKEND_URL = process.env.REACT_APP_CUSTOM_ENV_VAR;

function fetchSatData(pressure, tempurature, species, units) {
  return fetch(`${BACKEND_URL}/sat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pressure: pressure,
      units: units,
      species: species,
      tempurature: tempurature,
    }),
  });
}

function buildChartData(data) {
  let chartData = [];

  data.temp_values.forEach((value, idx) => {
    chartData.push({
      x: data.sat_liquid[idx],
      y: value,
    });
  });

  data.temp_values.forEach((value, idx) => {
    chartData.push({
      x: data.sat_vapor[idx],
      y: value,
    });
  });

  return chartData;
}

var options = {
  axisX: {
    type: Chartist.AutoScaleAxis,
    title: "Entropy (J/kgK)",
  },
  plugins: [
    chartistPluginAxisTitle({
      axisX: {
        axisTitle: "Entropy",
      },
      axisY: {
        axisTitle: "Temperature",
      },
    }),
  ],
  showPoint: false,
};

var type = "Line";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressure: 105,
      units: { uT: "K", up: "kPa", uE: "kJ", uM: "kg", uV: "m3" },
      species: "mp.H2O",
      satData: [],
      chartData: {
        temp_values: [],
        sat_vapor: [],
        sat_liquid: [],
      },
    };
  }

  getSatData = () => {
    fetchSatData(
      this.state.pressure,
      this.state.tempurature,
      this.state.species,
      this.state.units
    )
      .then((resp) => resp.json())
      .then((json) => {
        this.setState({ satData: json.values, chartData: json.chart_data });
      });
  };

  updateUnits = (units) => {
    this.setState({ units: units }, () => {
      this.getSatData();
    });
  };

  render() {
    return (
      <div style={{ margin: 16 }}>
        <Container fluid>
          <Row style={{ marginBottom: 32 }}>
            <Col xs={6}>
              <Card style={{ height: "100%" }}>
                <Card.Body style={{ height: "100%" }}>
                  <Card.Title>Saturation State Parameters</Card.Title>
                  <Form.Group as={Row}>
                    <Form.Label column sm="4">
                      Pressure
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={this.state.pressure}
                        onChange={(event) =>
                          this.setState({ pressure: event.target.value })
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm="4" disabled>
                      Temperature
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        aria-label="Default"
                        aria-describedby="inputGroup-sizing-default"
                        value={this.state.temperature}
                        onChange={(event) =>
                          this.setState({ temperature: event.target.value })
                        }
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column sm="4">
                      Species
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        aria-label="Default"
                        as="select"
                        aria-describedby="inputGroup-sizing-default"
                        value={this.state.species}
                        onChange={(event) =>
                          this.setState({ species: event.target.value })
                        }
                      >
                        <option>mp.H2O</option>
                        <option>mp.C2H2F4</option>
                        <option>mp.CO2</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                  <Button size={"block"} onClick={this.getSatData}>
                    Update
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6}>
              <Card style={{ height: "100%" }}>
                <Card.Body>
                  <Card.Title>Units</Card.Title>
                  <Form>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Pressure
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          size="sm"
                          as="select"
                          onChange={(event) =>
                            this.updateUnits({
                              ...this.state.units,
                              up: event.target.value,
                            })
                          }
                        >
                          <option>kPa</option>
                          <option>mmHg</option>
                          <option>psi</option>
                          <option>inHg</option>
                          <option>Pa</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Temperature
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          size="sm"
                          as="select"
                          onChange={(event) =>
                            this.updateUnits({
                              ...this.state.units,
                              uT: event.target.value,
                            })
                          }
                        >
                          <option>K</option>
                          <option>R</option>
                          <option>eV</option>
                          <option>C</option>
                          <option>F</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Energy
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          size="sm"
                          as="select"
                          onChange={(event) =>
                            this.updateUnits({
                              ...this.state.units,
                              uE: event.target.value,
                            })
                          }
                        >
                          <option>kJ</option>
                          <option>BTU</option>
                          <option>J</option>
                          <option>cal</option>
                          <option>eV</option>
                          <option>kcal</option>
                          <option>BTU_ISO</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Matter
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          size="sm"
                          as="select"
                          onChange={(event) =>
                            this.updateUnits({
                              ...this.state.units,
                              uM: event.target.value,
                            })
                          }
                        >
                          <option>kg</option>
                          <option>mg</option>
                          <option>g</option>
                          <option>oz</option>
                          <option>lb</option>
                          <option>lbm</option>
                          <option>slug</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm="4">
                        Volume
                      </Form.Label>
                      <Col sm="8">
                        <Form.Control
                          size="sm"
                          as="select"
                          onChange={(event) =>
                            this.updateUnits({
                              ...this.state.units,
                              uV: event.target.value,
                            })
                          }
                        >
                          <option>m3</option>
                          <option>USgal</option>
                          <option>cuft</option>
                          <option>ft3</option>
                          <option>cuin</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="mb-3" xs={12}>
              <Card>
                <Card.Body>
                  <Card.Title>Saturation State Values</Card.Title>
                  <Table
                    bordered
                    hover
                    size="sm"
                    style={{ textAlign: "center" }}
                  >
                    <thead>
                      <tr>
                        <th>Phase</th>
                        <th>T ({this.state.units.uT})</th>
                        <th>p ({this.state.units.up})</th>
                        <th>
                          v ({this.state.units.uV}/{this.state.units.uM})
                        </th>
                        <th>
                          u ({this.state.units.uE}/{this.state.units.uM})
                        </th>
                        <th>
                          h ({this.state.units.uE}/{this.state.units.uM})
                        </th>
                        <th>
                          s ({this.state.units.uE}/({this.state.units.uM}*
                          {this.state.units.uT}))
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.satData.map((row) => {
                        return (
                          <tr>
                            <td>{row.phase}</td>
                            <td>{row.t}</td>
                            <td>{row.p}</td>
                            <td>{row.v}</td>
                            <td>{row.e}</td>
                            <td>{row.h}</td>
                            <td>{row.s}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ height: 360 }}>
                <Card.Body style={{ height: 360 }}>
                  <ChartistGraph
                    style={{ height: 340 }}
                    data={{
                      series: [buildChartData(this.state.chartData)],
                    }}
                    options={options}
                    type={type}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
