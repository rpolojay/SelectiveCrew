export default function BlogPost({ params }) {
  const { slug } = params;
  
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <h1>Blog Post: {slug}</h1>
      <p>This blog post is being prepared.</p>
      <p>Please check back soon for the full article.</p>
      <a href="/blog" style={{ color: "#1a472a" }}>← Back to Blog</a>
    </div>
  );
}
