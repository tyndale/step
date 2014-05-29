package com.tyndalehouse.step.core.service.impl.suggestion;

import com.tyndalehouse.step.core.data.EntityDoc;
import com.tyndalehouse.step.core.exceptions.StepInternalException;
import com.tyndalehouse.step.core.service.SingleTypeSuggestionService;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.TopFieldCollector;

import java.io.IOException;

/**
 * A base class definition which handles different types of sort, as well as the creation of collectors
 */
public abstract class AbstractDefinitionSuggestionServiceImpl<S> implements SingleTypeSuggestionService<S, TopFieldCollector> {
    protected Sort popularSort;
    protected Sort sort;

    public AbstractDefinitionSuggestionServiceImpl(final Sort sort, final Sort popularSort) {
        this.sort = sort;
        this.popularSort = popularSort;
    }

    @Override
    public TopFieldCollector getNewCollector(final int leftToCollect, final boolean popularSort) {
        try {
            return TopFieldCollector.create(getSort(popularSort), leftToCollect > 0 ? leftToCollect : 1, false, false, false, false);
        } catch (IOException ex) {
            throw new StepInternalException(ex.getMessage(), ex);
        }
    }

    protected Sort getSort(boolean popular) {
        return popular ? this.popularSort : this.sort;
    }
}
