import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const { currentUser } = useSelector((state) => state.user)["user"];
  const [message, setMessage] = useState(null);
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${listing.userRef}`);
        const data = await res.json();

        if (data.success === false) return;
        setLandlord(data);
      } catch (error) {
        console.log(error);
        return;
      }
    }
    fetchUser();
  }, [listing.userRef]);
  function handleChange(e) {
    setMessage(e.target.value);
  }
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-4">
          <p className="text-xl pt-3">
            Contact <span className="font-semibold"> {landlord.username}</span>{" "}
            for
            <span className="font-semibold">{listing.name}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows={2}
            value={message}
            onChange={handleChange}
            placeholder="Message"
            className="w-full border p-3 rounded-lg "
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className="bg-slate-700 text-center p-3 rounded-lg
           text-white font-semibold hover:opacity-80">
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}
