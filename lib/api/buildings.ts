import { Building } from '@/lib/types';

/**
 * Loads all buildings from the Navigation API
 * @returns Promise resolving to array of buildings
 */
export async function loadBuildings(): Promise<Building[]> {
  try {
    console.log('Fetching buildings from local API proxy');
    const response = await fetch('/api/buildings', {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-cache', // Skip cache to ensure fresh data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load buildings: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      // The API might wrap buildings in an object
      if (Array.isArray(data.buildings)) {
        return data.buildings;
      } else if (Array.isArray(data.data)) {
        return data.data;
      } else if (Array.isArray(data.results)) {
        return data.results;
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error loading buildings:", error);
    throw error;
  }
}

/**
 * Saves buildings to the API
 * @param buildings Array of buildings to save
 * @returns Promise resolving to success message
 */
export async function saveBuildings(buildings: Building[]): Promise<string> {
  try {
    const response = await fetch('/api/buildings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildings),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save buildings: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.message || 'Buildings saved successfully';
  } catch (error) {
    console.error("Error saving buildings:", error);
    throw error;
  }
} 