import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'reservationFilter'
})
export class ReservationFilterPipe implements PipeTransform {

    transform(value: Array<any>, searchTerm: string = '') {
        if(searchTerm !== '') {
            let result = value.filter((reservation: any)  => { 
              return reservation.infoUser.nom.toLowerCase().includes(searchTerm.toLowerCase()) 
                || reservation.infoUser.prenom.toLowerCase().includes(searchTerm.toLowerCase())
                || reservation.heure.toLowerCase().includes(searchTerm.toLowerCase())
              });
            return result;
        } else {
            return value;
        }        
    }
} 