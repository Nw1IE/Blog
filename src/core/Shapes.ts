abstract class Shape { 
    abstract getArea(): number; 
}

class Rectangle extends Shape {
    // 1. Объявляем приватные поля класса
    private w: number;
    private h: number;

    constructor(w: number, h: number) { 
        super(); // Всегда вызываем super() первым делом в наследниках
        
        // 2. Присваиваем значения полям класса
        this.w = w;
        this.h = h;
    }

    public getArea(): number { 
        return this.w * this.h; 
    }
}