export interface MapAutocompleteProps {
    setAddress(address: string | null): void
}

export const LOCATION = {
	DNIPRO: {
		lat: 48.473910131640494,
		lng: 35.05549433455101,
	},
};

export const MAP_STYLE = {
	CONTAINER: {
		width: '100%',
		height: '100%',
		marginRight: '10px',
	},
};

export const libraries = ['drawing', 'geometry', 'places'] as ('drawing' | 'geometry' | 'localContext' | 'places' | 'visualization')[];
