#!/bin/bash

echo Downloading source datasets ...

echo CDIAC
echo =====
wget -O nation.1751_2013.csv 'http://cdiac.ornl.gov/ftp/ndp030/CSV-FILES/nation.1751_2013.csv'

echo PRIMAP-hist
echo ===========
wget -O PRIMAP-hist_v1.0_14-Apr-2016.csv 'http://escidoc.gfz-potsdam.de/ir/item/escidoc:1504004/components/component/escidoc:1504006/content'

echo CMIP6 concentration data
echo ========================
wget -O mole_fraction_of_carbon_dioxide_in_air_input4MIPs_GHGConcentrations_CMIP_UoM-CMIP-1-1-0_gr3-GMNHSH_000001-201412.csv 'ftp://data.iac.ethz.ch/CMIP6/input4MIPs/UoM/GHGConc/CMIP/mon/atmos/UoM-CMIP-1-1-0/GHGConc/gr3-GMNHSH/v20160701/mole_fraction_of_carbon_dioxide_in_air_input4MIPs_GHGConcentrations_CMIP_UoM-CMIP-1-1-0_gr3-GMNHSH_000001-201412.csv'

echo HadCRUT temperature data
echo ========================
wget -O HadCRUT.4.5.0.0.monthly_ns_avg.txt 'http://www.metoffice.gov.uk/hadobs/hadcrut4/data/current/time_series/HadCRUT.4.5.0.0.monthly_ns_avg.txt'
