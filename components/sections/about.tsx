/**
 * About section — a brief introduction to the church's mission and beliefs.
 */
export default function AboutSection() {
  const beliefs = [
    {
      title: "The Bible",
      description:
        "We believe the Bible is the inspired and authoritative Word of God — our guide for faith and daily living.",
      icon: "📖",
    },
    {
      title: "One Church",
      description:
        "We follow the New Testament pattern for the church, striving for unity among all who confess Christ as Lord.",
      icon: "✝️",
    },
    {
      title: "Baptism",
      description:
        "We teach baptism by immersion for the remission of sins, as commanded in the New Testament.",
      icon: "💧",
    },
    {
      title: "Community",
      description:
        "We are committed to genuine fellowship, supporting one another in faith, need, and daily life.",
      icon: "🤝",
    },
  ];

  return (
    <section
      id="about"
      className="bg-white py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-600">
            Who We Are
          </p>
          <h2
            id="about-heading"
            className="text-3xl font-bold text-gray-900 sm:text-4xl"
          >
            About Our Church
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            The Church of Christ Huddersfield is a congregation of Christians
            following the teaching and example of Jesus Christ as recorded in
            the New Testament.
          </p>
        </div>

        {/* Belief cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {beliefs.map((belief) => (
            <article
              key={belief.title}
              className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden="true">
                {belief.icon}
              </span>
              <h3 className="mt-3 font-semibold text-gray-900">
                {belief.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {belief.description}
              </p>
            </article>
          ))}
        </div>

        {/* Mission statement */}
        <div className="mt-16 rounded-2xl bg-blue-800 px-8 py-12 text-center text-white">
          <h3 className="text-2xl font-bold sm:text-3xl">Our Mission</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            &ldquo;To seek and save the lost, to edify the saved, and to serve our
            community — all to the glory of God.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
