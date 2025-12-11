-- Update RLS policies to use 'union' role instead of 'farmer'

-- Drop the old farmer-based policies
DROP POLICY IF EXISTS "Farmers can create batches" ON batches;
DROP POLICY IF EXISTS "Farmers can update own batches" ON batches;

-- Create new union-based policies
CREATE POLICY "Union can create batches"
    ON batches FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'union'
        )
    );

CREATE POLICY "Union can update own batches"
    ON batches FOR UPDATE
    USING (farmer_id = auth.uid());
