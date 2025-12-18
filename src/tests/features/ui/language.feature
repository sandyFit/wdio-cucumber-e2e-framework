Feature: Language Switching

    Scenario: Change language on Home page
        Given the user starts on the Home page
        When the user changes the site language to Spanish (ES)
        Then all interface text should appear in Spanish
        But product names should remain in their original language
