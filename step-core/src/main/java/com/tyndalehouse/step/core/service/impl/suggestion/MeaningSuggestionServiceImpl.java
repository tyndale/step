package com.tyndalehouse.step.core.service.impl.suggestion;

import com.tyndalehouse.step.core.data.EntityDoc;
import com.tyndalehouse.step.core.data.EntityIndexReader;
import com.tyndalehouse.step.core.data.EntityManager;
import com.tyndalehouse.step.core.exceptions.StepInternalException;
import com.tyndalehouse.step.core.models.LexiconSuggestion;
import com.tyndalehouse.step.core.models.search.PopularSuggestion;
import com.tyndalehouse.step.core.service.helpers.SuggestionContext;
import com.tyndalehouse.step.core.utils.StringUtils;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.PrefixQuery;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.SortField;
import org.apache.lucene.search.TopFieldCollector;

import javax.inject.Inject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author chrisburrell
 */
public class MeaningSuggestionServiceImpl extends AbstractDefinitionSuggestionServiceImpl<String> {
    private static final String[] ANCIENT_MEANING_FIELDS = new String[]{"stepGloss", "translations"};
    private static final SortField STEP_GLOSS_SORT_FIELD = new SortField("stepGloss", SortField.STRING_VAL);
    private static final Sort POPULAR_GLOSSES_SORT = new Sort(new SortField("popularity", SortField.INT, true), STEP_GLOSS_SORT_FIELD);
    private static final Sort STEP_GLOSS_SORT = new Sort(new SortField("stepGloss", SortField.STRING_VAL));
    private final EntityIndexReader definitions;

    @Inject
    public MeaningSuggestionServiceImpl(final EntityManager entityManager) {
        super(STEP_GLOSS_SORT, POPULAR_GLOSSES_SORT);
        definitions = entityManager.getReader("definition");
    }

    @Override
    public String[] getExactTerms(final SuggestionContext context, final int max, final boolean popularSort) {
        //no point in sorting, or retrieving more than 1 result
        final EntityDoc[] search = definitions.search(ANCIENT_MEANING_FIELDS, context.getInput(), null, 1);
        if (search.length > 0) {
            return new String[]{context.getInput()};
        }
        return new String[0];
    }

    @Override
    public String[] collectNonExactMatches(final TopFieldCollector collector,
                                           final SuggestionContext context,
                                           final String[] alreadyRetrieved, final int leftToCollect) {
        final String input = context.getInput();
        if (StringUtils.isBlank(input)) {
            return new String[0];
        }


        BooleanQuery q = new BooleanQuery();
        for (int ii = 0; ii < ANCIENT_MEANING_FIELDS.length; ii++) {
            q.add(new BooleanClause(new PrefixQuery(new Term(ANCIENT_MEANING_FIELDS[ii], input)), BooleanClause.Occur.SHOULD));
        }
        final EntityDoc[] search = definitions.search(q, null, collector);
        if(search.length == 0) {
            return new String[0];
        }

        //create the already retrieved list:
        final Set<String> previousResults = new HashSet<String>(alreadyRetrieved.length * 2);
        for(String s : alreadyRetrieved) {
            previousResults.add(s);
        }


        final LinkedHashSet<String> resultTerms = new LinkedHashSet<String>();

        //this is very crude and doesn't take account of analyzers
        Pattern p = Pattern.compile(String.format("(\\b%s[a-zA-Z-]*)", input.toLowerCase()));
        for (EntityDoc ed : search) {
            for (int ii = 0; ii < ANCIENT_MEANING_FIELDS.length; ii++) {
                final String fieldValue = ed.get(ANCIENT_MEANING_FIELDS[ii]);
                if (StringUtils.isNotBlank(fieldValue)) {
                    Matcher m = p.matcher(fieldValue.toLowerCase());
                    if (m.find()) {
                        do {
                            final String group = m.group();
                            if (!previousResults.contains(group) && !resultTerms.contains(group)) {
                                resultTerms.add(group);
                            }
                        } while (m.find());
                    }
                }
            }
        }

        return resultTerms.toArray(new String[resultTerms.size()]);
    }

    @Override
    public List<? extends PopularSuggestion> convertToSuggestions(final String[] meaningTerms, final String[] extraDocs) {
        List<LexiconSuggestion> suggestions = new ArrayList<LexiconSuggestion>();
        convertTermsToSuggestions(meaningTerms, suggestions);
        convertTermsToSuggestions(extraDocs, suggestions);
        return suggestions;
    }

    private void convertTermsToSuggestions(final String[] meaningTerms, final List<LexiconSuggestion> suggestions) {
        if (meaningTerms != null) {
            for (String term : meaningTerms) {
                final LexiconSuggestion suggestion = new LexiconSuggestion();
                suggestion.setGloss(term);
                suggestions.add(suggestion);
            }
        }
    }
}
