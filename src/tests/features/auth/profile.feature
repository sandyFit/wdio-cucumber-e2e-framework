Feature: User Profile Management

    Scenario: Update User Profile information
        Given the user is logged into their account
        And is on the Profile page
        When the user updates their password
        And clicks the Change Password button
        Then the new password should be saved successfully
        And a success message should appear
