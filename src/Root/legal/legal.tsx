import * as React from 'react';

// : Components
import C from '../../Components';

export const Legal: React.FC = () => {
  const Heading = (props: { children: string }) => (
    <C.Text size="tiny" face="Montserrat-Light">
      {props.children.toUpperCase()}
    </C.Text>
  );

  const Para = (props: { children: string }) => (
    <C.Text size="tiny" face="Montserrat-Light" style={{ paddingVertical: 10 }}>
      {props.children}
    </C.Text>
  );

  return (
    <C.Container>
      <C.Content style={{ margin: 20 }}>
        <C.Title purpose="subheading" style={{ fontWeight: 'bold' }}>
          License for 'Montserrat'
        </C.Title>

        <Para>SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007</Para>

        <Heading>Preamble</Heading>

        <Para>
          The goals of the Open Font License (OFL) are to stimulate worldwide development of collaborative font projects, to support the font creation efforts
          of academic and linguistic communities, and to provide a free and open framework in which fonts may be shared and improved in partnership with others.
          The OFL allows the licensed fonts to be used, studied, modified and redistributed freely as long as they are not sold by themselves. The fonts,
          including any derivative works, can be bundled, embedded, redistributed and/or sold with any software provided that any reserved names are not used by
          derivative works. The fonts and derivatives, however, cannot be released under any other type of license. The requirement for fonts to remain under
          this license does not apply to any document created using the fonts or their derivatives.
        </Para>

        <Heading>Definitions</Heading>
        <Para>
          “Font Software” refers to the set of files released by the Copyright Holder(s) under this license and clearly marked as such. This may include source
          files, build scripts and documentation.
        </Para>

        <Para>“Reserved Font Name” refers to any names specified as such after the copyright statement(s).</Para>

        <Para>“Original Version” refers to the collection of Font Software components as distributed by the Copyright Holder(s).</Para>

        <Para>
          “Modified Version” refers to any derivative made by adding to, deleting, or substituting—in part or in whole—any of the components of the Original
          Version, by changing formats or by porting the Font Software to a new environment.
        </Para>

        <Para>“Author” refers to any designer, engineer, programmer, technical writer or other person who contributed to the Font Software.</Para>

        <Heading>Permissions & Conditions</Heading>

        <Para>
          Permission is hereby granted, free of charge, to any person obtaining a copy of the Font Software, to use, study, copy, merge, embed, modify,
          redistribute, and sell modified and unmodified copies of the Font Software, subject to the following conditions:
        </Para>

        <Para>1) Neither the Font Software nor any of its individual components, in Original or Modified Versions, may be sold by itself.</Para>

        <Para>
          2) Original or Modified Versions of the Font Software may be bundled, redistributed and/or sold with any software, provided that each copy contains
          the above copyright notice and this license. These can be included either as stand-alone text files, human-readable headers or in the appropriate
          machine-readable metadata fields within text or binary files as long as those fields can be easily viewed by the user.
        </Para>

        <Para>
          3) No Modified Version of the Font Software may use the Reserved Font Name(s) unless explicit written permission is granted by the corresponding
          Copyright Holder. This restriction only applies to the primary font name as presented to the users.
        </Para>

        <Para>
          4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font Software shall not be used to promote, endorse or advertise any Modified
          Version, except to acknowledge the contribution(s) of the Copyright Holder(s) and the Author(s) or with their explicit written permission.
        </Para>

        <Para>
          5) The Font Software, modified or unmodified, in part or in whole, must be distributed entirely under this license, and must not be distributed under
          any other license. The requirement for fonts to remain under this license does not apply to any document created using the Font Software.
        </Para>

        <Heading>Termination</Heading>

        <Para>This license becomes null and void if any of the above conditions are not met.</Para>

        <Heading>Disclaimer</Heading>

        <Para>
          THE FONT SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE COPYRIGHT
          HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN
          AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT
          SOFTWARE.
        </Para>
      </C.Content>
    </C.Container>
  );
};
