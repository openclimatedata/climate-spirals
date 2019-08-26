#!/bin/bash

echo Downloading source datasets ...

echo CMIP6 concentration data
echo ========================
wget -O mole_fraction_of_carbon_dioxide_in_air_input4MIPs_GHGConcentrations_CMIP_UoM-CMIP-1-1-0_gr3-GMNHSH_000001-201412.csv 'ftp://data.iac.ethz.ch/CMIP6/input4MIPs/UoM/GHGConc/CMIP/mon/atmos/UoM-CMIP-1-1-0/GHGConc/gr3-GMNHSH/v20160701/mole_fraction_of_carbon_dioxide_in_air_input4MIPs_GHGConcentrations_CMIP_UoM-CMIP-1-1-0_gr3-GMNHSH_000001-201412.csv'

echo NOAA ESRL concentration data
echo ============================
wget -O co2_mm_gl.txt 'ftp://aftp.cmdl.noaa.gov/products/trends/co2/co2_mm_gl.txt'

echo HadCRUT temperature data
echo ========================
wget -O HadCRUT.4.6.0.0.monthly_ns_avg.txt 'http://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/time_series/HadCRUT.4.6.0.0.monthly_ns_avg.txt'
