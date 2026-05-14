interface Observer { update(data: any): void; }

class BlogNews {
    private observers: Observer[] = [];
    subscribe(o: Observer) { this.observers.push(o); }
    notify(news: string) { this.observers.forEach(o => o.update(news)); }
}