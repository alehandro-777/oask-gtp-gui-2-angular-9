export  class SmartDate {
   dt: Date;
    constructor(dateStr: string) {
        if (dateStr) {
           this.dt = new Date(dateStr);
           return;     
        }
       this.dt = new Date();
    }
    //add day and reset time 
    addDayResetTime(days: number) {
       this.dt.setDate(this.dt.getDate() + days);
       return this;
    }
    
    firstMonthDay() {
      this.dt.setDate(1);
      return this;
    }
   
    lastMonthDay() {
      this.firstMonthDay().addMonth(1).addDay(-1);
      return this;
    }
    
   addHours(hours: number) {
      this.dt.setTime(this.dt.getTime() + hours * 3600 * 1000);
      return this;
   }
   addMinutes(mins: number) {
      this.dt.setTime(this.dt.getTime() + mins * 60 * 1000);
      return this;
   }
   addSeconds(sec: number) {
      this.dt.setTime(this.dt.getTime() + sec * 1000);
      return this;
   }
   //add day and save time 
   addDay(days : number) {
       this.dt.setTime(this.dt.getTime() + days * 24 * 3600 * 1000);
       return this;
    }
    addMonth(mon: number) {
       this.dt.setMonth(this.dt.getMonth() + mon);
       return this;
    }
    addYears(years: number) {
      this.dt.setFullYear(this.dt.getFullYear() + years);
      return this;
   }
   nextHour() {
       this.dt.setHours(this.dt.getHours() + 1);
       this.dt.setMinutes(0, 0, 0); // Resets also seconds and milliseconds
     return this;
    }
    roundMinutes() {
       this.dt.setHours(this.dt.getHours() + Math.round(this.dt.getMinutes()/60));
       this.dt.setMinutes(0, 0, 0); // Resets also seconds and milliseconds
     return this;
    }
    resetMinutes() {
      this.dt.setMinutes(0, 0, 0); // Resets also seconds and milliseconds
    return this;
   }
   currGasDay() {
       this.dt.setHours(this.dt.getHours() -7);
       this.dt.setHours(7);
       this.dt.setMinutes(0, 0, 0); // Resets also seconds and milliseconds
     return this;
    }
    nextGasDay() {
       this.currGasDay().addDay(1);
     return this;
    }
    compareTo(other : SmartDate) {
      return this.dt.getTime() ===  other.dt.getTime();  
    }
  
    //enum: ["secs", "mins", "hours", "days", "months", "years"]
    getPreviousTimeStamp(key: string): SmartDate {
      switch (key) {
        case "secs":
          return this.addSeconds(-1);
        case "mins":
            return this.addMinutes(-1);
        case "hours":
            return this.addHours(-1);
        case "days":
            return this.addDay(-1);
        case "months":
            return this.addMonth(-1);
        case "years":
            return this.addYears(-1);
          default:
          return null;
      }
    }
   }