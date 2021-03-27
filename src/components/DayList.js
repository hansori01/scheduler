import React from 'react';
import DayListItem from './DayListItem';


export default function DayList(props) {

  const days = props.days.map(day => {
    function formatSpots() {
      if (day.spots > 1) {
        return day.spots + ' spots remaining';
      } else if (day.spots === 1) {
        return day.spots + ' spot remaining';
      }
      return 'no spots remaining';
    };

    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        formatSpots={formatSpots()}
        selected={day.name === props.day}
        setDay={() => props.setDay(day.name)}
      />
    )
  });

  return (
    <ul>
      {days}
    </ul>
  );
}