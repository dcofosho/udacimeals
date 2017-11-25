export const ADD_RECIPE = 'ADD_RECIPE'
export const REMOVE_FROM_CALENDAR = 'REMOVE_FROM_CALENDAR'

//action creators
export function addRecipe({day, recipe, meal}){
	//return a simple object with ADD_RECIPE type 
	//and recipe/day/meal values from args
	return {
		type: ADD_RECIPE,
		recipe,
		day,
		meal,
	}
}

export function removeFromCalendar({day, meal}){
	//return a simple object with "REMOVE_FROM_CALENDAR" type
	//and day/meal values from the args
	return{
		type: REMOVE_FROM_CALENDAR,
		day,
		meal,
	}
}