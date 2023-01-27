import ProfileLayout from '~/layouts/ProfileLayout';

const Profile = () => {
  return (
    <ProfileLayout>
      <div>NICE MÄN</div>
    </ProfileLayout>
  );
};

Profile.auth = { role: 'USER' };

export default Profile;
