import { useState } from 'react';
import { useSearchCruisesWithFilters, useGetAllCruiseDeals } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';
import { CruiseCard } from './CruiseCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { SearchFilters } from '../backend';

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [durationRange, setDurationRange] = useState<[number, number]>([1, 30]);

  const { data: allDeals } = useGetAllCruiseDeals();
  const { data: results, isLoading } = useSearchCruisesWithFilters(searchQuery, filters);

  // Extract unique values for filter dropdowns
  const destinations = Array.from(new Set(allDeals?.map(d => d.destination) || []));
  const cruiseLines = Array.from(new Set(allDeals?.map(d => d.cruiseLine) || []));
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSearch = () => {
    const newFilters: SearchFilters = {};
    
    if (filters.destination) newFilters.destination = filters.destination;
    if (filters.cruiseLine) newFilters.cruiseLine = filters.cruiseLine;
    if (filters.departureMonth) newFilters.departureMonth = filters.departureMonth;
    
    if (durationRange[0] > 1) newFilters.minDuration = BigInt(durationRange[0]);
    if (durationRange[1] < 30) newFilters.maxDuration = BigInt(durationRange[1]);
    
    if (priceRange[0] > 0) newFilters.minPrice = BigInt(priceRange[0]);
    if (priceRange[1] < 10000) newFilters.maxPrice = BigInt(priceRange[1]);

    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setPriceRange([0, 10000]);
    setDurationRange([1, 30]);
    setSearchQuery('');
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery.length > 0;

  return (
    <section id="search" className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-ocean-700 dark:text-ocean-400">
            Find Your Perfect Cruise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search and filter to discover amazing cruise itineraries
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search destinations or cruise lines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 h-12"
              />
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button 
              onClick={handleSearch}
              className="bg-ocean-600 hover:bg-ocean-700 text-white h-12 px-8"
            >
              Search
            </Button>
          </div>

          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Advanced Filters</span>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-ocean-600 hover:text-ocean-700"
                      >
                        <X className="mr-1 h-4 w-4" />
                        Clear All
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Destination</Label>
                      <Select
                        value={filters.destination || ''}
                        onValueChange={(value) => setFilters({ ...filters, destination: value || undefined })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any destination" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any destination</SelectItem>
                          {destinations.map((dest) => (
                            <SelectItem key={dest} value={dest}>
                              {dest}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Cruise Line</Label>
                      <Select
                        value={filters.cruiseLine || ''}
                        onValueChange={(value) => setFilters({ ...filters, cruiseLine: value || undefined })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any cruise line" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any cruise line</SelectItem>
                          {cruiseLines.map((line) => (
                            <SelectItem key={line} value={line}>
                              {line}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Departure Month</Label>
                      <Select
                        value={filters.departureMonth || ''}
                        onValueChange={(value) => setFilters({ ...filters, departureMonth: value || undefined })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any month</SelectItem>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>
                        Duration: {durationRange[0]} - {durationRange[1]} days
                      </Label>
                      <Slider
                        min={1}
                        max={30}
                        step={1}
                        value={durationRange}
                        onValueChange={(value) => setDurationRange(value as [number, number])}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                      </Label>
                      <Slider
                        min={0}
                        max={10000}
                        step={100}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Searching...</p>
          </div>
        )}

        {!isLoading && results && results.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Found {results.length} cruise{results.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((deal) => (
                <CruiseCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && hasActiveFilters && results && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No cruises found matching your criteria.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
