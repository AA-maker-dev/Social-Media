// index.js

document.addEventListener("DOMContentLoaded", () => {
    // Trending Posts
    const postsContainer = document.querySelector(".posts-container");
    const posts = [
        { user: "Tech Guru", content: "Exploring the future of AI 🚀", img: "https://source.unsplash.com/random/400x200/?technology" },
        { user: "Design Studio", content: "Minimalism in web design ✨", img: "https://source.unsplash.com/random/400x200/?design" },
        { user: "Web Dev Pro", content: "React vs Vue: Which one wins?", img: "https://source.unsplash.com/random/400x200/?coding" }
    ];

    posts.forEach(post => {
        const postCard = document.createElement("div");
        postCard.classList.add("post-card");
        postCard.innerHTML = `
            <img src="${post.img}" alt="Post Image" class="post-img">
            <div class="post-content">
                <h4>${post.user}</h4>
                <p>${post.content}</p>
            </div>
        `;
        postsContainer.appendChild(postCard);
    });

    // Trending Topics
    const topicsList = document.querySelector(".topics-list");
    const topics = ["#WebDesign", "#ReactJS", "#AI", "#UX", "#Frontend"];

    topics.forEach(topic => {
        const li = document.createElement("li");
        li.textContent = topic;
        topicsList.appendChild(li);
    });

    // Trending People
    const peopleContainer = document.querySelector(".people-container");
    const people = [
        { name: "Jane Doe", tag: "@jane_dev", img: "https://source.unsplash.com/random/100x100/?woman" },
        { name: "John Smith", tag: "@john_design", img: "https://source.unsplash.com/random/100x100/?man" },
        { name: "Creative Hub", tag: "@creativehub", img: "https://source.unsplash.com/random/100x100/?team" }
    ];

    people.forEach(person => {
        const personCard = document.createElement("div");
        personCard.classList.add("person-card");
        personCard.innerHTML = `
            <img src="${person.img}" alt="Person Avatar" class="avatar">
            <div>
                <h5>${person.name}</h5>
                <p>${person.tag}</p>
            </div>
            <button class="btn-follow">Follow</button>
        `;
        peopleContainer.appendChild(personCard);
    });
});