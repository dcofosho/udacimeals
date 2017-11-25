import { combineReducers } from 'redux'

import {
	ADD_RECIPE,
	REMOVE_FROM_CALENDAR
} from '../actions'

function food (state={}, action){
  switch (action.type) {
    case ADD_RECIPE :
      const { recipe } = action
      return {
        ...state,
        [recipe.label]: recipe
      }
    default :
      return state
  }
}

const initialCalendarState = {
  sunday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  monday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  tuesday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  wednesday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  thursday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  friday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  saturday: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
}

function calendar(state= initialCalendarState, action){
	
	const{day, recipe, meal} = action;

	switch(action.type){
		case ADD_RECIPE :
			return {
				//keep rest of state the same
				...state,
				//override day, which is an object with breakfast/lunch/dinner vals
				[day]: {
					//keep rest of that day the same
					...state[day],
					//modify the applicable meal for the applicable day.
					[meal]: recipe.label,
				}
			}
		case REMOVE_FROM_CALENDAR :
			return {
        //keep rest of state same
				...state,
        //override daym which is an object with breakfast/lunch/dinner vals
				[day]: {
          //keep rest of that day the same
					...state[day],
          //set the applicable meal for the applicable day to null.
					[meal]: null,
				}
			}
		default :
			return state
	}
}

export default combineReducers({
  food,
  calendar
});