CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth(id) ON DELETE CASCADE, -- Reference to the auth table
  role VARCHAR(50) NOT NULL,  -- Role column (admin/normal)
  created_at TIMESTAMPTZ DEFAULT NOW() -- Timestamp for when the user was created
);

CREATE TABLE images (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth(id) ON DELETE CASCADE, -- Reference to the auth table
  title VARCHAR(255) NOT NULL,
  link TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  tags TEXT[], -- Array of tags, nullable
  created_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp for when the image was created
  deleted_at TIMESTAMPTZ -- Optional: If you want to add soft delete support
);

CREATE TABLE temp_images (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth(id) ON DELETE CASCADE, -- Reference to the auth table
  title VARCHAR(255) NOT NULL,
  link TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  tags TEXT[], -- Array of tags, nullable
  created_at TIMESTAMPTZ DEFAULT NOW(), -- Timestamp for when the image was created
  deleted_at TIMESTAMPTZ -- Optional: If you want to add soft delete support
);

-- Enable Row-Level Security (RLS) on the images table
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Enable Row-Level Security (RLS) if not done already
ALTER TABLE temp_images ENABLE ROW LEVEL SECURITY;

-- Create or modify the policy for INSERT
CREATE POLICY temp_images_insert_policy
ON temp_images
FOR INSERT
WITH CHECK (auth.role() IS NOT NULL);  -- Allow only authenticated users


-- Drop and create the policy for public read access on images
DROP POLICY IF EXISTS "Public read access on images" ON images;
CREATE POLICY "Public read access on images"
ON images
FOR SELECT
USING (true);

-- Drop and create the policy for public insert access on images
DROP POLICY IF EXISTS "Public insert access on images" ON images;
CREATE POLICY "Public insert access on images"
ON images
FOR INSERT
WITH CHECK (true);

-- Drop and create the policy for public update access on images
DROP POLICY IF EXISTS "Public update access on images" ON images;
CREATE POLICY "Public update access on images"
ON images
FOR UPDATE
USING (true);

-- Drop and create the policy for public delete access on images
DROP POLICY IF EXISTS "Public delete access on images" ON images;
CREATE POLICY "Public delete access on images"
ON images
FOR DELETE
USING (true);
