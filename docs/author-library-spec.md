# Author Library

## Purpose

Author Library is the structured intellectual reference layer of the Executive Formation Path.

It is not a passive bookshelf. It is a guided study map that connects authors, books, schools of thought, concepts, and practical executive use.

## What each author profile must include

- Name
- School or tradition
- Historical context
- Main works
- Core concepts
- Practical relevance for executive formation
- Key warnings or limitations
- Related authors
- Related exercises
- Recommended order of study

## Data model

The implementation-ready model lives in:

- [src/features/formation/authorLibrary.ts](/Users/francobonafina/Projects/inutrack/inu-cogn/src/features/formation/authorLibrary.ts)

Core types:

- `AuthorProfile`
- `AuthorLibraryBook`
- `AuthorLibraryExerciseReference`
- `AuthorDiscipline`
- `AuthorPracticalUse`
- `AuthorLibraryFilterState`
- `AuthorLibraryCardViewModel`

## Example profiles

Included in code:

- Adam Smith
- Clausewitz
- Peter Drucker

These examples show the intended tone and depth for the rest of the library.

## UI card design

Each author card should show:

1. Author name
2. School or tradition
3. Practical use tags
4. Up to 3 core concepts
5. One-line executive relevance

Design direction:

- dark, quiet, and scan-friendly
- no visual clutter
- emphasis on practical use, not biographical trivia
- mobile-first card stack with clear tap target

## Filtering by discipline

Supported disciplines:

- political economy
- economics
- philosophy
- sociology
- strategy
- management
- communication
- negotiation
- military strategy
- political theory

## Filtering by practical use

Supported practical-use filters:

- market analysis
- executive judgment
- organizational design
- founder strategy
- commercial positioning
- risk management
- communication
- negotiation
- power mapping
- institutional analysis

## Search behavior

Search should match:

- author name
- school or tradition
- historical context
- main works
- core concepts
- practical relevance
- related authors

Ranking priority:

1. exact author name
2. work title matches
3. core concept matches
4. practical relevance and context matches

## AI-generated author summary prompt

The reusable summary prompt builder is in:

- [src/features/formation/authorLibrary.ts](/Users/francobonafina/Projects/inutrack/inu-cogn/src/features/formation/authorLibrary.ts)

Purpose:

- generate concise executive summaries
- explain why an author matters now
- point out common misreadings
- suggest the next useful authors to study

## Author set to include

- Adam Smith
- David Ricardo
- Karl Marx
- Carl Menger
- Ludwig von Mises
- Friedrich Hayek
- Israel Kirzner
- John Maynard Keynes
- Juan Domingo Perón
- Karl Popper
- Thomas Kuhn
- Michael Polanyi
- Nassim Taleb
- Hegel
- Nietzsche
- Max Weber
- Michel Foucault
- Pierre Bourdieu
- René Girard
- Sun Tzu
- Clausewitz
- John Boyd
- Peter Drucker
- Andy Grove
- Michael Porter
- Richard Rumelt
- Clayton Christensen
- Barbara Minto
- Robert Cialdini
- April Dunford
- Chris Voss
