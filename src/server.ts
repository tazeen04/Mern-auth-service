function welcome(name: string) {
    console.log(`Welcome, ${name}!`);

    const user = {
        name: 'ameena',
    };

    const fname = user.name;

    return name + fname;
}

welcome('John Doe');
