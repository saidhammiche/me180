const express = require("express");
const cors = require("cors");
const { InfluxDB } = require("@influxdata/influxdb-client");

const app = express();
app.use(cors());

const url = "http://172.16.1.97:8086";
const token = "NPpro-jVnJM8zUCPIGhHUrRF08lhZ47XsVPaRO2SwPIjFvsrAJpQGRB71DoGinnvD_yqXW8mTtFqeZ72vWcIzA==";
const org = "home";
const bucket = "mE180letzte";

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

app.get("/data", async (req, res) => {
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -10m)
      |> filter(fn: (r) => r._measurement == "me180")
      |> filter(fn: (r) => r.Device == "mE180")
      |> filter(fn: (r) => r._field == "Strom" or r._field == "Wirkleistung" or r._field == "Spannung" or r._field == "Leistungsfaktor" or r._field == "Energie")
      |> filter(fn: (r) => r.Kanal =~ /^CH[1-9]$|^CH1[0-8]$/)
      |> last()
  `;

  try {
    const rows = await queryApi.collectRows(fluxQuery);
    console.log("Lignes reçues:", rows.length);

    let result = {};

    rows.forEach(row => {
      const kanal = row.Kanal;
      const field = row._field;
      let value = row._value;
      const label = row.Label || "";

      if (!result[kanal]) {
        result[kanal] = { Label: label };
      }

      if (field === "Leistungsfaktor") {
        result[kanal]["CosinusPhi"] = value;
      }
      else if (field === "Wirkleistung") {
        result[kanal]["Wirkleistung"] = value;
      }
      else if (field === "Spannung") {
        result[kanal]["Spannung"] = value;
      }
      else if (field === "Strom") {
        result[kanal]["Strom"] = value;
      }
      else if (field === "Energie") {
        // Division par 1000 pour convertir Wh en kWh
        const energyInKwh = value / 1000;
        result[kanal]["Energie"] = Math.round(energyInKwh * 100) / 100;
      }
    });

    // Calculer Scheinleistung (S = U * I) et Blindleistung (Q = √(S² - P²))
    Object.keys(result).forEach(kanal => {
      const U = result[kanal]["Spannung"];
      const I = result[kanal]["Strom"];
      const P = result[kanal]["Wirkleistung"];
      const cosPhi = result[kanal]["CosinusPhi"];
      
      // Méthode 1: S = U * I
      if (U && I && U > 0 && I > 0) {
        const S = U * I;
        result[kanal]["Scheinleistung"] = S;
        
        // Méthode 2: Si on a P, on peut calculer Q
        if (P !== undefined && P !== null && S > 0) {
          const Q = Math.sqrt(Math.abs(S * S - P * P));
          result[kanal]["Blindleistung"] = Q;
        }
        // Sinon, si on a cosPhi, on peut calculer P et Q
        else if (cosPhi !== undefined && cosPhi !== null && cosPhi > 0) {
          const P2 = S * cosPhi;
          result[kanal]["Wirkleistung"] = P2;
          const Q2 = S * Math.sqrt(1 - cosPhi * cosPhi);
          result[kanal]["Blindleistung"] = Q2;
        }
      } else {
        result[kanal]["Scheinleistung"] = null;
        result[kanal]["Blindleistung"] = null;
      }
    });

    console.log("Canaux trouvés:", Object.keys(result));
    res.json(result);

  } catch (error) {
    console.error("ERREUR:", error);
    res.status(500).send("Erreur: " + error.message);
  }
});

app.listen(4000, () => {
  console.log("Serveur sur http://localhost:4000");
});