# Stadtwerke Flensburg Gewinndaten

## `swfl_business.csv`
|   |  |
|:--|--|
| sales             | Umsätze (inkl. Strom- und Erdgassteuer)        |
| energy_taxes      | Strom und Erdgassteuer                         |
| EBIT              | Earnings Before Interest and Taxes             |
| earnings          | Jahresüberschuss / Fehlbetrag                  |
| dividend          | Gewinnausschüttung an Stadt Flensburg          |
| sales_corp        | Umsätze Konzern (inkl. Strom und Erdgassteuer) |
| earnings_corp     | Jahresüberschuss / Fehlbetrag Konzern          |
| EBIT_corp         | Earnings Before Interest and Taxes Konzern     |
| equity            | Eigenkapital                                   |
| provision         | Rückstellungen                                 |
| credit_liabilities        | ges. Verbindlichkeiten ggü. Kreditinst. (lt. Passiva) |
| credit_liabilities_short  | Verbindlichkeiten ggü. Kreditinst. \< 1 Jahr   |
| credit_liabilities_medium | Verbindlichkeiten ggü. Kreditinst. 1 - 5 Jahre |
| credit_liabilities_long   | Verbindlichkeiten ggü. Kreditinst. > 5 Jahre   |
| other_liabilities | Andere Verbindlichkeiten                               |
| employees         | Mitarbeitende GmbH (ohne Auszubildende) am 31.12.      |
| trainees          | Auszubildende GmbH am 31.12.                           |
| employees_corp    | Mitarbeitende Konzern (ohne Auszubildende) am 31.12.   |
| trainees_corp     | Auszubildende Konzern am 31.12.                        |

## `swfl_overview_electricity.csv`

|   |  |
|:--|--|
| customers       | Stromkund*innen bundesweit                 |         |
| grid_high       | Hochspannungsnetz                          | km      |
| grid_medium     | Mittelspannungsnetz                        | km      | 
| grid_low        | Niederspannungsnetz                        | km      |
| households      | Hausanschlüsse                             |         |
| meters          | Zähler im Netz                             |         |
| production      | Netto-Stromerzeugung Mio. kWh              | GWh     |
| sales           | "Nutzbare Abgabe" / Stromabsatz in Mio kWh | GWh     |
| sales_flensburg | Stromabsatz Flensburg (Prozent von Gesamt) | %       |
| capacity        | Brutto-Kraftwerksleistung bei voller Heizwärmeabgabe | MW    |
| peak            | Höchstbelastung im Netz                    | MW      |

## `swfl_overview_electricity.csv`

|   |  |  |
|:--|--|--|
| grid            | Leitungsnetz                               | km      |
| sales           | "Nutzbare Abgabe" / Wärmeabsatz in Mio kWh | GWh     |
| households      | Hausanschlüsse                             |         |
| meters          | Zähler im Netz                             |         |
| production      | Wärmeerzeugung in Mio. kWh                 | GWh     |
| capacity        | Erzeugungskapazität                        | MW      |
| peak            | Höchstbelastung im Netz                    | MW      |

## `swfl_overview_water.csv`

|   |  |  |
|:--|--|--|
| grid             | Leitungsnetz                               | km       |
| households       | Hausanschlüsse                             |          |
| meters           | Zähler im Netz                             |          |
| production       | Wasserförderung                            | Mio m³   |
| sales            | "Nutzbare Abgabe" / Wasserabsatz in Mio m³ | Mio m³   |
| production_daily | Tägliche Förderleistung                    | 1.000 m³ |
| peak_day         | Höchste Tagesabgabe                        | 1.000 m³ |

## `swfl_overview_harbour.csv`

|   |  |  |
|:--|--|--|
| ships       | Eingelaufene Schiffe            |         |
| cargo       | Güterumschlag                   | 1.000 t |

## `swfl_overview_waste.csv`

|   |  |  |
|:--|--|--|
| handling    | Müll-Umschlag AWZ               | 1.000 t |

## `swfl_overview_airport.csv`

|   |  |  |
|:--|--|--|
| flight_ops  | Flugbewegungen                  | 1.000   |

## `swfl_emissions.csv`

Fossile CO₂-Emissionen und Gratis-Zertifikate laut EU ETS

|   |  |  |
|:--|--|--|
| year             | Geschäftsjahr                                                 |
| co2_main         | Emissionen Hauptstandort Batteriestr. (Installation-ID: 760)  |
| co2_north        | Emissionen Reserveheizwerk Nord (Installation-ID: 733)        |
| co2_south        | Emissionen Reserveheizwerk Süd (Installation-ID: 734)         |
| co2_engelsby     | Emissionen Reserveheizwerk Engelsby (Installation-ID: 736)    |
| co2_gluecksburg  | Emissionen Reserveheizwerk Glücksburg (Installation-ID: 716)  |
| foc_main         | Gratis-Zertifikate für Hauptstandort                          |
| foc_north        | Gratis-Zertifikate für Reserveheizwerk Nord                   |
| foc_south        | Gratis-Zertifikate für Reserveheizwerk Süd                    |
| foc_engelsby     | Gratis-Zertifikate für Reserveheizwerk Engelsby               |
| foc_gluecksburg  | Gratis-Zertifikate für Reserveheizwerk Glücksburg             |

## `swfl_mix_electricity.csv`

Auswertung Daten Stromkennzeichnung

|   |  |  |
|:--|--|--|
| carbon_per_kwh  | CO₂-Emissionen pro kWh                | Gramm   |
| nuclear_pc      | Anteil Kernenergie                    | %       |
| coal_pc         | Anteil Stein- & Braunkohle            | %       |
| gas_pc          | Anteil Erdgas                         | %       |
| other_fossil_pc | Anteil sonstige fossile Energieträger | %       |
| renewables_pc   | Anteil EE mit Herkunftsnachweisen     | %       |
| eeg_pc          | Anteil EEG-Umlage                     | %       |

## `swfl_mix_heat.csv`

|   |  |  |
|:--|--|--|
| grid              | Netzgebiet                            |         |
| carbon_per_kwh    | CO₂-Emissionen pro kWh                | Gramm   |
| coal_pc           | Anteil Steinkohle                     | %       |
| gas_pc            | Anteil Erdgas                         | %       |
| biogas_pc         | Anteil Biogas                         | %       |
| oil_heavy_pc      | Anteil Schweröl                       | %       |
| oil_light_pc      | Anteil Leichtöl                       | %       |
| chips_pc          | Anteil Holzhackschnitzel              | %       |
| chips_recycled_pc | Anteil Altholzhackschnitzel           | %       |
| waste_pc          | Anteil "Ersatzbrennstoffe" (=Müll)    | %       |
