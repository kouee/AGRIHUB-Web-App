'use client';

import React, { useState, useMemo } from 'react';
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
import hydroponicsData from '@/app/data/hydroponics-data.json';
import { format } from 'date-fns';

type DataRecord = {
  timestamp: string;
  ph: number;
  ec: number;
  temp_c: number;
  water_level_percent: number;
};

const data: DataRecord[] = hydroponicsData.map(d => ({
    ...d,
    ph: Number(d.ph),
    ec: Number(d.ec),
    temp_c: Number(d.temp_c),
    water_level_percent: Number(d.water_level_percent)
}));


export default function Dashboard() {
  const [filter, setFilter] = useState<string>('all');

  const filteredData = useMemo(() => {
    const now = data.length;
    if (filter === 'all') {
      return data;
    }
    const numRecords = parseInt(filter, 10);
    return data.slice(Math.max(0, now - numRecords));
  }, [filter]);

  const formattedData = useMemo(() => {
    return filteredData.map(d => ({
      ...d,
      formattedTimestamp: format(new Date(d.timestamp), 'MMM d, HH:mm'),
    }));
  }, [filteredData]);

  const downloadCSV = () => {
    const headers = ['timestamp', 'ph', 'ec', 'temp_c', 'water_level_percent'];
    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
    
    csvContent += filteredData
      .map(row => headers.map(header => row[header as keyof DataRecord]).join(','))
      .join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'agrihub_data.csv');
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


  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>System Analytics</CardTitle>
            <CardDescription>
              Viewing {filter === 'all' ? 'all' : `last ${filter}`} records.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="10">Last 10 Records</SelectItem>
                <SelectItem value="25">Last 25 Records</SelectItem>
                <SelectItem value="50">Last 50 Records</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={downloadCSV}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download CSV</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
                <h3 className="text-lg font-semibold mb-2 text-center">pH & EC Over Time</h3>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="formattedTimestamp" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis yAxisId="left" domain={[5, 7]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" domain={[1, 2.5]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="ph" name="pH" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="ec" name="EC (mS/cm)" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false}/>
                </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="h-80">
                <h3 className="text-lg font-semibold mb-2 text-center">Temperature & Water Level</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="formattedTimestamp" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                        <YAxis yAxisId="left" domain={[15, 30]} label={{ value: '°C', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} label={{ value: '%', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="temp_c" name="Temp (°C)" fill="hsl(var(--chart-1))" />
                        <Line yAxisId="right" type="monotone" dataKey="water_level_percent" name="Water Level (%)" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Data Log</h3>
          <div className="max-h-96 overflow-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">pH</TableHead>
                  <TableHead className="text-right">EC (mS/cm)</TableHead>
                  <TableHead className="text-right">Temp (°C)</TableHead>
                  <TableHead className="text-right">Water Level (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formattedData.slice().reverse().map(row => (
                  <TableRow key={row.timestamp}>
                    <TableCell>{format(new Date(row.timestamp), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                    <TableCell className="text-right">{row.ph.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{row.ec.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{row.temp_c.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{row.water_level_percent.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
