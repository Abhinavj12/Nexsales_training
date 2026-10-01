import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword
} from "../services/userService";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();

        console.log("Profile Response:", response);

        const user = response.data;

        setProfile(user);

        setFirstName(user.first_name || "");
        setLastName(user.last_name || "");

      } catch (error) {
        console.error("Profile Error:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await updateMyProfile({
        first_name: firstName,
        last_name: lastName
      });

      console.log("Update Profile Response:", response);

      setProfile(response.data);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      setMessage("Profile updated successfully");

    } catch (error) {
      console.error("Update Profile Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    try {
      setPasswordSaving(true);
      setMessage("");
      setError("");

      await changeMyPassword({
        current_password: currentPassword,
        new_password: newPassword
      });

      setCurrentPassword("");
      setNewPassword("");

      setMessage("Password changed successfully");

    } catch (error) {
      console.error("Change Password Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to change password"
      );

    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main style={{ padding: "30px" }}>
          <h2>Loading profile...</h2>
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />

        <main style={{ padding: "30px" }}>
          <h2>{error || "Profile not found"}</h2>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ padding: "30px" }}>
        <h1>My Profile</h1>

        {message && (
          <p
            style={{
              padding: "10px",
              background: "#e8f5e9"
            }}
          >
            {message}
          </p>
        )}

        {error && (
          <p
            style={{
              padding: "10px",
              background: "#ffebee",
              color: "red"
            }}
          >
            {error}
          </p>
        )}

        <section
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "30px",
            borderRadius: "8px"
          }}
        >
          <h2>Profile Information</h2>

          <p>
            <strong>Email:</strong>{" "}
            {profile.email}
          </p>

          <p>
            <strong>Role:</strong>{" "}
            {profile.role}
          </p>

          <form onSubmit={handleUpdateProfile}>
            <div style={{ marginBottom: "15px" }}>
              <label>First Name</label>
              <br />

              <input
                type="text"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Last Name</label>
              <br />

              <input
                type="text"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
              />
            </div>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Update Profile"}
            </button>
          </form>
        </section>

        <section
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px"
          }}
        >
          <h2>Change Password</h2>

          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: "15px" }}>
              <label>Current Password</label>
              <br />

              <input
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>New Password</label>
              <br />

              <input
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
              />
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
            >
              {passwordSaving
                ? "Changing..."
                : "Change Password"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default Profile;