'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import hydroponicsData from '@/app/data/hydroponics-data-nov-to-feb.json';
import { format, subHours, subDays, isAfter, parse } from 'date-fns';

type DataRecord = {
  timestamp: string;
  ec_value: number | null;
  ph_value: number | null;
  water_temp: number | null;
  lux_value: number | null;
  humidity: number | null;
  surround_temp: number | null;
  water_level: string;
  dosing_pump: string;
};

const parseDate = (timestamp: string) => parse(timestamp, 'yyyy/MM/dd HH:mm:ss', new Date());

// This function now flattens the nested JSON structure and sorts it chronologically
const data: DataRecord[] = Object.values(hydroponicsData)
  .flatMap(dayData => Object.values(dayData))
  .map((d: any) => ({
    timestamp: d.timestamp,
    ec_value: d.ec_value === 'N/A' ? null : Number(d.ec_value),
    ph_value: d.ph_value === 'N/A' || d.ph_value === 'N/á' ? null : Number(d.ph_value),
    water_temp: d.water_temp === 'N/A' ? null : Number(d.water_temp),
    lux_value: d.lux_value === 'N/A' ? null : Number(d.lux_value),
    humidity: d.humidity === 'N/A' ? null : Number(d.humidity),
    surround_temp: d.surround_temp === 'N/A' ? null : Number(d.surround_temp),
    water_level: d.water_level,
    dosing_pump: d.dosing_pump,
  }))
  .sort((a, b) => parseDate(a.timestamp).getTime() - parseDate(b.timestamp).getTime());

const validDates = data
  .map(d => parseDate(d.timestamp))
  .filter(d => d instanceof Date && !isNaN(d.getTime()));

const latestDate = validDates.length > 0
  ? new Date(Math.max(...validDates.map(d => d.getTime())))
  : new Date();


export default function Dashboard() {
  const [filter, setFilter] = useState<string>('7d');
  const [isClient, setIsClient] = useState(false);
  
  // State for table data filtering and pagination
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const availableDates = useMemo(() => {
    // Sort dates in descending order (most recent first)
    return Object.keys(hydroponicsData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, []);

  // Filtering for charts
  const filteredDataForCharts = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const now = latestDate;

    if (filter === 'all') {
      return data;
    }

    let startDate: Date;
    switch (filter) {
      case '24h':
        startDate = subHours(now, 24);
        break;
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      default:
        return data;
    }
    
    return data.filter(d => {
        const dDate = parseDate(d.timestamp);
        return dDate instanceof Date && !isNaN(dDate.getTime()) && isAfter(dDate, startDate);
    });

  }, [filter]);

  const formattedDataForCharts = useMemo(() => {
    return filteredDataForCharts.map(d => ({
      ...d,
      formattedTimestamp: isClient ? format(parseDate(d.timestamp), 'MMM d, HH:mm') : '',
    }));
  }, [filteredDataForCharts, isClient]);

  
  // Filtering and pagination for the table
  const tableData = useMemo(() => {
    setCurrentPage(1); // Reset page when filter changes
    const reversed = data.slice().reverse();
    if (selectedDate === 'all') {
        return reversed;
    }
    return reversed.filter(d => d.timestamp.startsWith(selectedDate.replace(/-/g, '/')));
  }, [selectedDate]);

  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tableData.slice(startIndex, endIndex);
  }, [tableData, currentPage]);
  
  const filterLabels: { [key: string]: string } = {
    '24h': 'the last 24 hours of data',
    '7d': 'the last 7 days of data',
    '30d': 'the last 30 days of data',
    all: 'all time',
  };

  const downloadCSV = () => {
    const headers: (keyof DataRecord)[] = ['timestamp', 'ph_value', 'ec_value', 'water_temp', 'surround_temp', 'humidity', 'lux_value', 'water_level', 'dosing_pump'];
    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
    
    csvContent += tableData // download data from table
      .map(row => headers.map(header => {
        const val = row[header];
        if(val === null || val === undefined) return 'N/A';
        return val;
      }).join(','))
      .join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrihub_data_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/80 backdrop-blur-sm p-2 border border-border rounded-lg shadow-lg">
          <p className="label font-bold">{`${label}`}</p>
          {payload.map((pld: any, index: number) => (
             <p key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value}`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const yAxisDomain = (dataKey: keyof Omit<DataRecord, 'timestamp' | 'water_level' | 'dosing_pump'>) => {
    const values = filteredDataForCharts.map(d => d[dataKey]).filter(v => v !== null) as number[];
    if (values.length === 0) return ['auto', 'auto'];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 1;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>System Analytics</CardTitle>
            <CardDescription>
              Showing charts for {filterLabels[filter]}.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {formattedDataForCharts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-80">
                    <h3 className="text-lg font-semibold mb-2 text-center">pH & EC Over Time</h3>
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedDataForCharts}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="formattedTimestamp" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis yAxisId="left" domain={yAxisDomain('ph_value')} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis yAxisId="right" orientation="right" domain={yAxisDomain('ec_value')} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="ph_value" name="pH" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} connectNulls />
                        <Line yAxisId="right" type="monotone" dataKey="ec_value" name="EC (mS/cm)" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} connectNulls/>
                    </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="h-80">
                    <h3 className="text-lg font-semibold mb-2 text-center">Temperature Analysis</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedDataForCharts}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="formattedTimestamp" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <YAxis yAxisId="left" domain={yAxisDomain('water_temp')} label={{ value: '°C', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
                            <YAxis yAxisId="right" orientation="right" domain={yAxisDomain('surround_temp')} label={{ value: '°C', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="water_temp" name="Water Temp (°C)" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} connectNulls />
                            <Line yAxisId="right" type="monotone" dataKey="surround_temp" name="Air Temp (°C)" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} connectNulls />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="h-80">
                <h3 className="text-lg font-semibold mb-2 text-center">Humidity</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedDataForCharts}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="formattedTimestamp" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis domain={yAxisDomain('humidity')} label={{ value: '%', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="humidity" name="Humidity (%)" fill="hsl(var(--chart-3))" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold">Data Log</h3>
                <div className="flex items-center gap-2">
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      {availableDates.map(date => (
                        <SelectItem key={date} value={date}>{date}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={downloadCSV}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download CSV</span>
                  </Button>
                </div>
              </div>
              <div className="max-h-[600px] overflow-auto border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">pH</TableHead>
                      <TableHead className="text-right">EC (mS/cm)</TableHead>
                      <TableHead className="text-right">Water Temp (°C)</TableHead>
                      <TableHead className="text-right">Air Temp (°C)</TableHead>
                      <TableHead className="text-right">Humidity (%)</TableHead>
                      <TableHead className="text-right">Lux</TableHead>
                      <TableHead>Water Level</TableHead>
                      <TableHead>Dosing Pump</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map(row => (
                      <TableRow key={row.timestamp}>
                        <TableCell>{isClient ? format(parseDate(row.timestamp), 'yyyy-MM-dd HH:mm:ss') : ''}</TableCell>
                        <TableCell className="text-right">{row.ph_value !== null ? row.ph_value.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{row.ec_value !== null ? row.ec_value.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{row.water_temp !== null ? row.water_temp.toFixed(1) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{row.surround_temp !== null ? row.surround_temp.toFixed(1) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{row.humidity !== null ? row.humidity.toFixed(1) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{row.lux_value !== null ? row.lux_value : 'N/A'}</TableCell>
                        <TableCell>{row.water_level}</TableCell>
                        <TableCell>{row.dosing_pump}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
               <div className="flex items-center justify-end space-x-2 py-4">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
              <p>No data to display for the selected period.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
