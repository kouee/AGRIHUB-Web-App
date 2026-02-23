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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Download, Calendar as CalendarIcon } from 'lucide-react';
import hydroponicsData from '@/app/data/hydroponics-data-nov-to-feb.json';
import { format, parse, isAfter, isBefore, addMinutes, subDays } from 'date-fns';
import { cn } from "@/lib/utils"

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

const parseDate = (timestamp: string): Date | null => {
  let date = parse(timestamp, 'yyyy/MM/dd HH:mm:ss', new Date());
  if (isNaN(date.getTime())) {
    date = parse(timestamp, 'yyyy-MM-dd HH:mm:ss', new Date());
  }
  return isNaN(date.getTime()) ? null : date;
};

const allDataRaw: any[] = Object.values(hydroponicsData).flatMap(dayData => Object.values(dayData));

const data: DataRecord[] = allDataRaw
  .map(d => {
    const date = parseDate(d.timestamp);
    if (!date) return null;

    const parsed = {
      ...d,
      date: date,
      ec_value: d.ec_value !== "N/A" && d.ec_value != null ? parseFloat(d.ec_value) : null,
      ph_value: d.ph_value !== "N/A" && d.ph_value != null ? parseFloat(d.ph_value) : null,
      water_temp: d.water_temp !== "N/A" && d.water_temp != null ? parseFloat(d.water_temp) : null,
      lux_value: d.lux_value !== "N/A" && d.lux_value != null ? parseInt(d.lux_value, 10) : null,
      humidity: d.humidity !== "N/A" && d.humidity != null ? parseFloat(d.humidity) : null,
      surround_temp: d.surround_temp !== "N/A" && d.surround_temp != null ? parseFloat(d.surround_temp) : null,
    };
    return parsed;
  })
  .filter((d): d is Exclude<typeof d, null> => d !== null)
  .sort((a, b) => b.date!.getTime() - a.date!.getTime())
  .map(({ date, ...rest }) => rest as DataRecord);

const latestDate = data.length > 0 ? parseDate(data[0].timestamp)! : new Date();
const earliestDate = data.length > 0 ? parseDate(data[data.length - 1].timestamp)! : new Date();


export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: subDays(latestDate, 7),
    to: latestDate,
  });

  const [resolution, setResolution] = useState('1h');

  const [selectedTableDate, setSelectedTableDate] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const availableDates = useMemo(() => {
    return Object.keys(hydroponicsData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, []);

  const resolutionInMinutes = useMemo(() => {
    switch(resolution) {
      case '30m': return 30;
      case '1h': return 60;
      case '2h': return 120;
      case '4h': return 240;
      case '12h': return 720;
      case '24h': return 1440;
      default: return 60;
    }
  }, [resolution]);

  const downsampledData = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return [];

    const rangeData = data.filter(d => {
        const date = parseDate(d.timestamp);
        if (!date) return false;
        return (date.getTime() >= dateRange.from!.getTime() && date.getTime() <= dateRange.to!.getTime());
    });

    if (rangeData.length === 0) return [];
    
    const result: DataRecord[] = [];
    let currentTime = new Date(dateRange.from.getTime());

    while (currentTime.getTime() <= dateRange.to.getTime()) {
      const intervalEnd = addMinutes(currentTime, resolutionInMinutes);
      
      const pointsInInterval = rangeData.filter(p => {
          const pDate = parseDate(p.timestamp)!;
          return pDate.getTime() >= currentTime.getTime() && pDate.getTime() < intervalEnd.getTime();
      });

      if(pointsInInterval.length > 0) {
        const closestPoint = pointsInInterval.reduce((prev, curr) => {
            const prevDiff = Math.abs(parseDate(prev.timestamp)!.getTime() - currentTime.getTime());
            const currDiff = Math.abs(parseDate(curr.timestamp)!.getTime() - currentTime.getTime());
            return currDiff < prevDiff ? curr : prev;
        });
        if (!result.find(r => r.timestamp === closestPoint.timestamp)) {
           result.push(closestPoint);
        }
      }
      
      currentTime = intervalEnd;
    }
    
    return result;

  }, [dateRange, resolutionInMinutes]);


  const formattedDataForCharts = useMemo(() => {
    return downsampledData.map(d => ({
      ...d,
      formattedTimestamp: isClient ? format(parseDate(d.timestamp)!, 'MMM d, HH:mm') : '',
    }));
  }, [downsampledData, isClient]);

  
  const tableData = useMemo(() => {
    setCurrentPage(1);
    
    if (selectedTableDate === 'all') {
        return data;
    }
    const normalizedSelectedDate = selectedTableDate.replace(/-/g, '/');
    return data.filter(d => d.timestamp.startsWith(normalizedSelectedDate));
  }, [selectedTableDate]);

  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return tableData.slice(startIndex, endIndex);
  }, [tableData, currentPage]);
  
  const downloadCSV = () => {
    const headers: (keyof DataRecord)[] = ['timestamp', 'ph_value', 'ec_value', 'water_temp', 'surround_temp', 'humidity', 'lux_value', 'water_level', 'dosing_pump'];
    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
    
    csvContent += tableData
      .map(row => headers.map(header => {
        const val = row[header];
        if(val === null || val === undefined) return 'N/A';
        return val;
      }).join(','))
      .join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrihub_data_${selectedTableDate}.csv`);
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
    if (formattedDataForCharts.length === 0) return ['auto', 'auto'];
    const values = formattedDataForCharts.map(d => d[dataKey]).filter(v => v !== null) as number[];
    if (values.length === 0) return ['auto', 'auto'];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.2 || 1;
    const finalMin = Math.max(0, Math.floor(min - padding));
    const finalMax = Math.ceil(max + padding);
    return [finalMin, finalMax];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>System Analytics</CardTitle>
            <CardDescription>
              Showing data from {isClient && dateRange.from ? format(dateRange.from, "LLL dd, y") : ''} to {isClient && dateRange.to ? format(dateRange.to, "LLL dd, y") : ''} with a {resolution} resolution.
            </CardDescription>
          </div>
           <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={(date) =>
                    isBefore(date, earliestDate) || isAfter(date, latestDate)
                  }
                />
              </PopoverContent>
            </Popover>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30m">Every 30 minutes</SelectItem>
                <SelectItem value="1h">Every 1 hour</SelectItem>
                <SelectItem value="2h">Every 2 hours</SelectItem>
                <SelectItem value="4h">Every 4 hours</SelectItem>
                <SelectItem value="12h">Every 12 hours</SelectItem>
                <SelectItem value="24h">Every 24 hours</SelectItem>
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
                  <Select value={selectedTableDate} onValueChange={setSelectedTableDate}>
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
                        <TableCell>{isClient ? format(parseDate(row.timestamp)!, 'yyyy-MM-dd HH:mm:ss') : ''}</TableCell>
                        <TableCell className="text-right">{typeof row.ph_value === 'number' ? row.ph_value.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{typeof row.ec_value === 'number' ? row.ec_value.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{typeof row.water_temp === 'number' ? row.water_temp.toFixed(1) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{typeof row.surround_temp === 'number' ? row.surround_temp.toFixed(1) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{typeof row.humidity === 'number' ? row.humidity.toFixed(1) : 'N/A'}</TableCell>
                        <TableCell className="text-right">{typeof row.lux_value === 'number' ? row.lux_value : 'N/A'}</TableCell>
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
