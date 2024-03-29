export function convertDurationToTimeString(duration: number){
    //horas
    const hours = Math.floor(duration / (60*60))
    //minutos
    const minutes = Math.floor((duration%3600 ) / 60)
    //segundos
    const seconds = Math.floor(duration % 60)
    
    const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2,'0'))
    .join(':')

    return timeString;

}