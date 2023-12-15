## Generating an ERD

It is possible to automatically generate an ERD.
There are a bunch of websites that offer this functionality.

I (Mark) used https://www.lucidchart.com.
Here you can make a free account. The limitation seems to be that you can only have 3 files stored. Which is 2 more than I need for this project.

## Making the ERD:

1. Make a new document in Lucid after logging in (LucidChart -> Blank Document).
2. Close the templates.
3. Click on "Import Data" in bottom left corner.
4. Select ERD.
5. Click on import data, select "from SQL database".
6. Select database archetype of choice, we currently use PostgreSQL.
7. Copy the SQL command at the bottom.
8. Run it in pgAdmin 4 (the program we currently use to look at the DB). To do this: Right click on the attendance database and select Query Tool.
9. This generates some SQL schemas. Save these in .csv format.
10. Click on the "Next" button below the SQL command in your browser (you might have to scroll down a bit).
11. Upload the file and click "Import".
12. Drag the table names from the bottom left corner into the work area in the middle. The relationships are automatically added once you add the relevant tables.
13. You can adjust the locations of both the lines and end points by clicking on them once to select them, and then on the next click dragging them. To move the end points, you have to click on them and then drag the blue dot somewhere else. This lets you move them between the left and right side. Do be careful, since you can put those anywhere (also on other attributes or attached to nothing).
14. Once it looks like what you want (ideally no crossing lines) and in a fairly logical layout, you should save the document. This way you can edit it at a later time if needed.

## Exporting the ERD:

1. The editor itself has a menu bar too. Go to File -> Export -> SVG to save as an SVG file.

## Editing the ERD:

1. On the start page of LucidChart (once you're logged in), you can see the ERD in their "My Documents" folder in your browser.

## Updating the ERD:

The free account has the limitation that you can only import a file once. So you'll have to delete the uploaded file in your document. Then you can upload the new .csv file.

1. Open the document of your choice in LucidChart.
2. Delete the old file by clicking on the trashcan, near the bottom left corner just above the table names.
3. Go through the "Making the ERD" process steps 3-14.
