import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Paper, InputBase, IconButton } from "@mui/material";

import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  
  const [user, setUser] = useState(null);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingOccupation, setIsEditingOccupation] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [newOccupation, setNewOccupation] = useState("");
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditClick = async (field) => {
    if (field === "location") {
      setIsEditingLocation(true);
    } else if (field === "occupation") {
      setIsEditingOccupation(true);
    }
  };

  const handleSaveClick = async (key) => {
    const apiUrl = `http://localhost:3000/users/${userId}`;
  
    let updateField = {};
    let newValue = "";
  
    if (key === "location") {
      updateField = { location: newLocation };
      newValue = newLocation;
      setIsEditingLocation(false);
    } else if (key === "occupation") {
      updateField = { occupation: newOccupation };
      newValue = newOccupation;
      setIsEditingOccupation(false);
    }
  
    try {
      const response = await fetch(`${apiUrl}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateField),
      });
      if (!response.ok) {
        throw new Error(`Failed to update ${key}`);
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      // Handle error
    }
  };
  

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends?.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>
      <Divider />

      <Box p="1rem 0">
  <FlexBetween gap="1rem" mb="0.5rem">
    <FlexBetween gap="1rem" alignItems="center">
      <LocationOnOutlined fontSize="large" />
      {isEditingLocation ? (
        <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200 }}>
          <InputBase
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            fullWidth
            placeholder="Edit Location"
            inputProps={{ 'aria-label': 'edit location' }}
          />
          <IconButton onClick={() => handleSaveClick("location")}>
            <EditOutlined />
          </IconButton>
        </Paper>
      ) : (
        <Typography
          onClick={() => handleEditClick("location")}
          sx={{ cursor: "pointer" }}
        >
          {location}
        </Typography>
      )}
    </FlexBetween>
  </FlexBetween>

  <FlexBetween gap="1rem" mb="0.5rem">
    <FlexBetween gap="1rem" alignItems="center">
      <WorkOutlineOutlined fontSize="large" />
      {isEditingOccupation ? (
        <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200 }}>
          <InputBase
            value={newOccupation}
            onChange={(e) => setNewOccupation(e.target.value)}
            fullWidth
            placeholder="Edit Occupation"
            inputProps={{ 'aria-label': 'edit occupation' }}
          />
          <IconButton onClick={() => handleSaveClick("occupation")}>
            <EditOutlined />
          </IconButton>
        </Paper>
      ) : (
        <Typography
          onClick={() => handleEditClick("occupation")}
          sx={{ cursor: "pointer" }}
        >
          {occupation}
        </Typography>
      )}
    </FlexBetween>
  </FlexBetween>
</Box>


      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} onClick={() => handleEditClick("twitter")} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} onClick={() => handleEditClick("linkedin")} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
